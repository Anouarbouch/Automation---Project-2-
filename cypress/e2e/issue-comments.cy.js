import { faker } from "@faker-js/faker";
const commentSelector = '[data-testid="issue-comment"]';
const placeholder = 'textarea[placeholder="Add a comment..."]';
const addcomm = "Add a comment...";
describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .wait(30000)
      .should("eq", `${Cypress.env("baseUrl")}project/board/`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const comment = "TEST_COMMENT_EDITED";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", previousComment)
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });

  ///here is my work
  it.only("Should edit a comment successfully", () => {
    const previousComment = faker.lorem.words();
    const randomComment = faker.lorem.words();

    CreateComment(previousComment);
    EditComment(randomComment, previousComment);
    DeleteComment(randomComment);
  });
});
function CreateComment(comment) {
  getIssueDetailsModal().within(() => {
    cy.contains(addcomm).click();

    cy.get(placeholder).type(comment);

    cy.contains("button", "Save").click().should("not.exist");

    cy.contains(addcomm).should("exist");
    cy.get(commentSelector).should("contain", comment);
  });
}
function EditComment(comment, prevcomment) {
  getIssueDetailsModal().within(() => {
    cy.get(commentSelector)
      .first()
      .contains("Edit")
      .click()
      .should("not.exist");

    cy.get(placeholder).should("contain", prevcomment).clear().type(comment);

    cy.contains("button", "Save").click().should("not.exist");

    cy.get(commentSelector).should("contain", "Edit").and("contain", comment);
  });
}
function DeleteComment(comment) {
  getIssueDetailsModal().find(commentSelector).contains("Delete").click();

  cy.get('[data-testid="modal:confirm"]')
    .contains("button", "Delete comment")
    .click()
    .should("not.exist");

  getIssueDetailsModal()
    .wait(30000)
    .find(commentSelector)
    .contains(comment)
    .should("not.exist");
}
