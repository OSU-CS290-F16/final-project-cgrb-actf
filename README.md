# Assignment 2

**Due at 4:59pm on Friday 10/21/2016**

**Code Blog entry due at 4:59pm on Monday 10/24/2016**

The goal of this assignment is to start to use JavaScript to add interactions to a web page, including reacting to user-generated events and accessing and manipulating the DOM.  We will build off of our work from Assignment 1.

Here, you are provided with an `index.html` file and a `style.css` file that, combined, give you the ToDoIt page we worked on in Assignment 1 (plus a little more).  You are also provided with an empty `index.js` file.  Your task is to fill out `index.js` to add the following interactions to the page:

1. Clicking on the dismiss button for any specific todo note should remove that note from the page.

2. Clicking on the red "+" button should display a modal for adding a new todo note to the page.  The modal (along with a backdrop) are both currently already included in the DOM, but they are hidden.  Clicking the red "+" button should un-hide them.  The modal should have the following behaviors:

  * Clicking the modal close button (the small "X" in the upper-right corner) or the modal cancel button (the one in the modal footer that says "Cancel") should close the modal by re-hiding it and its backdrop.

  * Clicking the modal accept button (the one that says "Add ToDo" in the modal footer) should close the modal and generate a new todo note after all the other ones within the `<main>` element.  The new todo note should follow the structural template provided by the ones that already exist in `index.html`:

    * The value of the "What" field should form the title of the todo note within an `<h2>` element.

    * The values of the "Where", "When", and "Who" fields should be added to a `<p>` element along with a `<span>` element providing a where/when/who label.  Use the same classes as are used in the example todo notes to provide the same styling.  Each of these `<p>` elements should be placed within a `<div>` with class `todo-body`.

    * The value of the "Details" field should be added to a `<p>` element without a label.  This should also be placed in the `div.todo-body`.

    * The new todo note should have a working dismiss button, like the other ones.

  * If the value of the "What" field is not specified in the modal, clicking the modal accept button should have the same effect as clicking the close or cancel buttons (i.e. the modal should close and no new todo note should be created).

  * Whenever the modal is closed (either by clicking the accept button or by clicking the close or cancel buttons), the values in the input fields should be cleared so they don't appear the next time the modal is opened.

## Extra Credit

For extra credit, you may perform some data validation on the values of the modal's input fields when the accept button is pressed.  If the "What" field does not have a value specified, alert the user (using the `alert()` function), and keep the modal open until the user either closes/cancels it or provides a value for "What" field and clicks the accept button.

## Grading criteria

Only changes to `index.js` will be considered when grading this assignment.  Any changes you make to `index.html` or `style.css` will be ignored.

The assignment is worth 100 points total:

* Dismiss button: 30 points
  * Clicking the dismiss button for any note removes it from the page

* Adding a note: 70 points
  * 15 points: clicking the red "+" button displays the modal and backdrop
  * 15 points: clicking the modal's close or cancel button hides the modal and backdrop
  * 30 points: clicking the modal's accept button closes the modal and adds a new todo note (with appropriate structure/appearance) to the end of the page.  No note is added if there is no value specified in the "What" field.
  * 10 points: all input field values are cleared whenever the modal is closed so that they do not appear the next time the modal is opened.

The extra-credit data validation is worth 10 points.

## Code Blog

Add an entry to your Code Blog reflecting on your experience with this assignment.  Here are some questions you could answer (though these aren't the only ones):

* What was challenging about the assignment, and what specific kinds of problems did you have.  How did you solve those problems?

* What did you learn from the assignment?  Were there any special insights you had?  What did you find that you already knew?

* What kinds of resources were helpful for completing the assignment?  Specific websites?  Lectures?  The class Piazza forum?  The TAs?  How did you use each of these resources?

* What are one or two things you had to Google to complete the assignment?

Publish your new entry to the same place where you published your entry for Assignment 1.  If you did not email me the URL to your Code Blog for Assignment 1, please email it to me.

This Code Blog entry is due at 4:59pm on Monday 10/24/2016.

## Submission

We'll be using GitHub Classroom for this assignment. You will submit your assignment via GitHub. Just make sure your completed `index.js` file is committed and pushed by the assignment's deadline to the master branch of the GitHub repo that was created for you by GitHub Classroom.  Note that you do not need to publish your page anywhere.
# final-project-cgrb=actf
