# Testing Library Recipes - Choosing query

As frontend developers, we build software that lives in the browser. The DOM is the abstraction we rely on for creating user interfaces. Thus, testing a web application means making assertions about the DOM and its behavior.

Testing Library provides several query methods for obtaining a DOM element, each of which behaves differently and adapts to a specific context. Choosing the right query is a key skill in building robust and durable tests. Testing Library queries can be classified according to three main characteristics:

- **Type** (get…, query…, find…): _get…_ and _query…_ are synchronous methods and the difference between them is whether the query will throw an error if no items are found. _find…_ will return a Promise and wait for the element to be on the screen.
- **Quantity** (…By…, …AllBy…): defines whether the query matches a single or multiple elements.
- **Selector** (…Role, …LabelText, …Text, _etc._): defines how to search the element.

We can choose both the type and the selector following an `if (…) … else if () … else if (…) …` chain. I know, there are a lot of design patterns for building scalable software architectures and the `if else if` chain is not one of the best, but I don't know how to refactor an article by applying the Strategy pattern 😅.

## Choosing the Type

### if (the element is in the document)

Pick the `getBy…` method.

This is the most common case. The element appears on the screen as soon as the component is rendered. The `getBy…` method **throws** an error if the element isn't on the screen _or_ if more than one match is found, causing the test to fail. While it is tempting to use `getBy…` methods as "implicit assertion", it is best to write an **explicit expectation** for it.

```javascript
import { render, screen } from "@testing-library/react";

test("should show login form", () => {
  render(<Login />);
  const input = screen.getByLabelText("Username");
  expect(input).toBeInTheDocument();
});
```

> **Advice:** avoid using `toBeDefined` or other not explicit Jest matchers to verify that the element is visible on the screen. The `@testing-library/jest-dom` package provides the matcher `toBeInTheDocument`, which is the most expressive for doing this.

### else if (the element will be in the document)

Pick the `findBy…` method.

This is the right choice if asynchronous operations are involved and the component renders the element when an asynchronous task ends or a promise is resolved. For example, if the element will be on the screen after a network request (during tests network requests will be mocked).

```javascript
import { render, screen } from "@testing-library/react";

test("should show the product detail", async () => {
  render(<ProductDetail />);
  const price = await screen.findByText("20€");
  expect(price).toBeInTheDocument();
});
```

> **Advice:** prefer `find*` over `waitFor`+`get*` to query something that may not be immediately available - it's simpler and the error message you get will be better.

```javascript
// ❌
const submitButton = await waitFor(() =>
  screen.getByRole("button", { name: /submit/i })
);
// ✅
const submitButton = await screen.findByRole("button", { name: /submit/i });
```

### else // the element is not in the document

Pick the `queryBy…` method.

The `queryBy…` methods are most appropriate when checking for the absence of an element. A `queryBy…` method returns `null` if the element is not on the screen, unlike `getBy…` which throws an error.

```javascript
import { render, screen } from "@testing-library/react";

test("should show the product detail without any alert", () => {
  render(<ProductDetail />);
  const alert = screen.queryByRole("alert");
  expect(alert).not.toBeInTheDocument();
});
```

> **Advice:** only use the `query*` variants for asserting that an element cannot be found.

## Choosing the Quantity

### if (querying multiple elements)

Pick the corresponding `…AllBy…` version of the choosen **type** of query.

The `…AllBy…` version of the query does not throw an error if multiple elements match but it returns an array of elements.

```javascript
import { render, screen } from "@testing-library/react";

test("should show a list of products", () => {
  const products = [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ];
  render(<ProductsList products={products} />);
  const productListItems = screen.getAllByRole("listitem");
  expect(productListItems).toHaveLength(products.length);
});
```

## Choosing the Selector

In this section I'll refer to the following component to write some example of tests.

```javascript
// login.js
export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <img src="/logo.svg" width="100" height="100" alt="logo" />
      <p>Welcome user!</p>
      <form>
        <label>
          Username
          <input type="text" name="username" placeholder="Type the username" />
        </label>
        <label>
          Password
          <input type="text" name="password" placeholder="Type the password" />
        </label>
        <button type="submit">Login</button>
      </form>
      <span title="copyright">Copyright © 2021 Mirco Bellagamba</span>
    </div>
  );
}
```

### if (the element is accessible by its role and name)

Pick [`…ByRole`](https://testing-library.com/docs/queries/byrole).

You should prefer the `…ByRole` selector over the others because it matches the items exposed in the [accessibility tree](https://developer.mozilla.org/en-US/docs/Glossary/AOM). The `name` option allows you to specify its accessible name as well. If you can't get the item by its role and name, ask yourself if you're creating an inaccessible UI. Writing [semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/semantics) is a good starting point for building an accessible user interface. Assistive technologies, such as screen readers, recognize these elements and allow you to navigate the page in a [structured way](https://www.w3.org/WAI/tutorials/page-structure/). For example, it is better to use a `<button>` instead of binding a click listener with a generic `div`.

```javascript
import { screen } from "@testing-library/react";

const submitButton = screen.getByRole("button", { name: /login/i });
```

> **Advice #1:** make sure your UI are always accessible for everyone. Check out the list of [Accessible Roles on MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles).

> **Advice #2:** I personally find RegExp really useful for matching element name or text without worrying about the case of characters. RegExps are really powerful but it's best not to rely on them too much: using them we are able to match almost anything and large RegExps could lead to poor testing.

### else if (the element is a form input with a label)

Pick [`…ByLabelText`](https://testing-library.com/docs/queries/bylabeltext).

Getting an element by the label text is the best way to get form fields. This method is not very useful for other HTML elements but it should be your preference for inputs because it requires you to provide a [label](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) for it.

```javascript
import { screen } from "@testing-library/react";

const username = screen.getByLabelText("Username");
const password = screen.getByLabelText("Password");
```

### else if (the element is a form input without a label)

Pick [`…ByPlaceholder`](https://testing-library.com/docs/queries/byplaceholder).

If you can't provide a label or can't use the label text to identify form fields, try getting them through placeholder text. Like the previous selector, it is only useful for input elements.

```javascript
import { screen } from "@testing-library/react";

const username = screen.getByPlaceholderText(/username/i);
const password = screen.getByPlaceholderText(/password/i);
```

### else if (the element is a non-interactive element)

Pick [`…ByText`](https://testing-library.com/docs/queries/bytext).

This is the best way to get non-interactive elements, like _div_ and _span_. You shouldn't use it for form elements, buttons, or any element that could be obtained with a `…ByRole` query. You may be tempted to use it every time, because it is easier to match texts than to match accessible role and name, but in this way your tests will be more fragile and you lose any guarantee on the accessibility of your page.

```javascript
import { screen } from "@testing-library/react";

const welcomeText = screen.getByText(/welcome/i);
```

### else if (the element is an input with a display value)

Pick [`…ByDisplayValue`](https://testing-library.com/docs/queries/bydisplayvalue).

This is an alternative method for getting inputs. The docs says:

> The current value of a form element can be useful when navigating a page with filled-in values.

Until now I have never faced a situation that made this method my preferred choice because I prefer to get an input from the text of its label and make an assertion about its value rather than getting it from its display value. However it could be useful when external libraries are involved or when we are unable to modify the input to make it accessible via the label text (_this is very sad 😢_).

```javascript
import { screen } from "@testing-library/react";

const username = screen.getByDisplayValue("mircoBellaG");
```

### else if (the element supports an alt text)

Pick [`…ByAltText`](https://testing-library.com/docs/queries/byalttext).

This method is useful to get elements supporting `alt` text (`img`, `area` and `input`).

```javascript
import { screen } from "@testing-library/react";

const logoImg = screen.getByAltText("logo");
```

### else if (the element has a title attribute)

Pick [`…ByTitle`](https://testing-library.com/docs/queries/bytitle).

The title attribute is not consistently read by screenreaders, and is not visible by default for sighted users. For this reason, tests that use it give you less confidence than those that aren't. It could also be used to get SVG from its title.

```javascript
import { screen } from "@testing-library/react";

const copyrightText = screen.getByTitle("copyright");
```

### else

Pick [`…ByTestId`](https://testing-library.com/docs/queries/bytestid).

If nothing else doesn't fit your element, you should give it a `data-testid` attribute and use it in your tests. This is the case for elements the user cannot see (or hear), so this is only recommended for cases where you can't match by role or text or it doesn't make sense (e.g. the text is dynamic). While it's easier to create tests using this method by default, try using it only if it's actually difficult or impossible to do otherwise. Using testids makes tests more prone to false positives because it doesn't assert anything about the structure of your UI. However, it is still a good option for many cases like localized apps, loading spinners, mocked elements.

```javascript
import { screen } from "@testing-library/dom";

const element = screen.getByTestId("custom-element");
```

> **Advice:** Before adding a `data-testid` you should always ask yourself: _"Why do I need to get an element that the user is not aware of? Am I testing an implementation detail?"_.

## Helpers and manual queries

There are Testing Library helper methods that work with queries. As elements appear and disappear in response to actions, Async APIs like [`waitFor`](https://testing-library.com/docs/dom-testing-library/api-async#waitfor) or [`findBy` queries](https://testing-library.com/docs/dom-testing-library/api-async#findby-queries) can be used to await the changes in the DOM. To find only elements that are children of a specific element, you can use [`within`](https://testing-library.com/docs/dom-testing-library/api-within). If necessary, there are also a few options you can [configure](https://testing-library.com/docs/dom-testing-library/api-configuration), like the timeout for retries and the default testID attribute.

> **Advice:** Use `within` helper to test your modal or your accordion items but it should not be used frequently because it ties your tests to the page structure. Do not use it as a shortcut to test implementation details (_I know you miss the shallow rendering from Enzyme 😜_).

As final note, remember that you are running test in the DOM and you can use the regular [`querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) DOM API to query elements. However, it's better to use a testid if you have to, to make your intention to fall back to non-semantic queries clear and establish a stable API contract in the HTML.

## Testing Playground

Still not sure which query to use? [Testing Playground](https://testing-playground.com/) can help you choose the right query. It is a super useful tool that suggests Testing Library queries for the selected item. You can download it as [Chrome Extension](https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano) or as [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/testing-playground) and directly run for the app you are developing!

## Code reference

Check out [https://github.com/mbellagamba/testing-library-recipes](https://github.com/mbellagamba/testing-library-recipes) if you want to understand how to use in practice Testing Library queries. The example in the folder [1-choosing-query](https://github.com/mbellagamba/testing-library-recipes/tree/main/1-choosing-query) contains a test exploring all the query methods.

## Conclusion

As developers, we love algorithms and code. So, why not write an algorithm for choosing testing libraries query?

```javascript
function getQuery() {
  return getQueryType() + getQueryQuantity() + getQuerySelector();
}

function getQueryType() {
  if (isInTheDocument()) {
    return "get";
  } else if (willBeInTheDocument()) {
    return "find";
  } else {
    // The element is not in the document
    return "query";
  }
}

function getQueryQuantity() {
  if (areThereMultipleElements()) {
    return "All";
  } else {
    return "";
  }
}

function getQuerySelector() {
  if (isAccessibleByItsRoleAndName()) {
    return "ByRole";
  } else if (isAccessibleByItsLabelText()) {
    return "ByLabelText";
  } else if (isAnInputWithAPlaceholder()) {
    return "ByPlaceholder";
  } else if (isNonInteractiveText()) {
    return "ByText";
  } else if (isAnInputWithAValue()) {
    return "ByDisplayValue";
  } else if (hasAnAltText()) {
    return "ByAltText";
  } else if (hasATitleAttribute()) {
    return "ByTitle";
  } else {
    return "ByTestId";
  }
}
```

It's just a funny joke, but it helps me figure out which query I should use.

The most important concept is to **avoid testing the internal behavior of components** and emulate users as much as possible. Testing Library is not designed to test implementation details because it makes your tests fragile. If you try to do this, the library will fight you by making it very complex. This is one of the things I love most about Testing Library.

Happy testing and always remember the [Guiding principles](https://testing-library.com/docs/guiding-principles)!

## Further references

Check out these super useful resources for a deeper understanding.

- [About queries](https://testing-library.com/docs/queries/about)
- [Common mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
