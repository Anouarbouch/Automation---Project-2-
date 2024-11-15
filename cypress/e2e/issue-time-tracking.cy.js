import { faker } from "@faker-js/faker";
import {
  createissue,
  TimeModal,
  StopWatchButton,
  RegisteredLoggedTimetxt,
  RegisteredRemainingTimetxt,
  TimeField,
  NoTimeField,
  RegisteredEstimatedTimetxt,
} from "../pages/functions_selectors_constants";
//Random number constants are declared here for the use of the faker plugin
const estimatedTime = faker.number.int({ min: 1, max: 24 });
const estimatedTimeUpdated = faker.number.int({ min: 1, max: 24 });
const loggedTime = faker.number.int({ min: 1, max: 24 });
const loggedTimeUpdated = faker.number.int({ min: 1, max: 24 });
const remainingTime = faker.number.int({ min: 1, max: 24 });
const remainingTimeUpdated = faker.number.int({ min: 1, max: 24 });
describe("assert time tracking functionality of a create issue", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
        createissue();
      });
  });

  it("Should assert adding, editing and clearing the estimated time in the issue", () => {
    //Add time value
    cy.contains(NoTimeField).should("be.visible");
    EnterEstimatedTimeValue(estimatedTime);
    // Edit time value
    cy.get(TimeField).clear();
    EnterEstimatedTimeValue(estimatedTimeUpdated);
    // clearing time value
    cy.get(TimeField).clear();
    AssertClearedTimeValue(estimatedTime, estimatedTimeUpdated);
  });

  it("Should assert adding, editing and clearing logged time values", () => {
    // Add estimated time for new issue
    EnterEstimatedTimeValue(estimatedTime);
    // Add logged time within modal
    EnterLoggedTimeValue(loggedTime, remainingTime);
    AssertLoggedTimeValue(loggedTime, remainingTime, estimatedTime);
    // Editing logged and remaining time
    EnterLoggedTimeValue(loggedTimeUpdated, remainingTimeUpdated);
    AssertLoggedTimeValue(
      loggedTimeUpdated,
      remainingTimeUpdated,
      estimatedTime
    );
    // clearing logged and remaining time
    ClearLoggedTimeValue();
    AssertClearedLoggedTimeValue(loggedTime, remainingTime, estimatedTime);
  });
});

function EnterEstimatedTimeValue(TimeValue) {
  // Adds estimated time value to the created issue with assertion
  cy.get(TimeField).type(TimeValue);
  cy.get(TimeField).should("have.value", TimeValue);
  cy.contains(`${TimeValue}${RegisteredEstimatedTimetxt}`).should("be.visible");
}
function AssertClearedTimeValue(PreviousTimeValue, NewTimeValue) {
  // Edit the estimated time value with assertion
  cy.contains(`${PreviousTimeValue}${RegisteredEstimatedTimetxt}`).should(
    "not.exist"
  );
  cy.contains(`${NewTimeValue}${RegisteredEstimatedTimetxt}`).should(
    "not.exist"
  );
  cy.contains(NoTimeField).should("be.visible");
}
function EnterLoggedTimeValue(loggedTimeValue, remainingTimeValue) {
  // Add logged time value to the created issue with assertion that time modal has been closed
  cy.get(StopWatchButton).click();
  cy.get(TimeModal)
    .should("be.visible")
    .within(() => {
      cy.get(TimeField).eq(0).type(loggedTimeValue);
      cy.get(TimeField).eq(1).type(remainingTimeValue);

      cy.contains("button", "Done").click();
    });

  cy.get(TimeModal).should("not.exist");
}
function AssertLoggedTimeValue(
  loggedTimeValue,
  remainingTimeValue,
  EstimatedTimeValue
) {
  // Assert and confirm the logged and remaining time
  cy.contains(`${loggedTimeValue}${RegisteredLoggedTimetxt}`).should(
    "be.visible"
  );
  cy.contains(`${remainingTimeValue}${RegisteredRemainingTimetxt}`).should(
    "be.visible"
  );
  cy.contains(`${EstimatedTimeValue}${RegisteredEstimatedTimetxt}`).should(
    "not.exist"
  );
  cy.contains(NoTimeField).should("not.exist");
}
function ClearLoggedTimeValue() {
  // Clear the logged and remaining time
  cy.get(StopWatchButton).click();
  cy.get(TimeModal)
    .should("be.visible")
    .within(() => {
      cy.get(TimeField).eq(0).clear();
      cy.get(TimeField).eq(1).clear();

      cy.contains("button", "Done").click();
    });

  cy.get(TimeModal).should("not.exist");
}
function AssertClearedLoggedTimeValue(
  loggedTimeValue,
  remainingTimeValue,
  EstimatedTimeValue
) {
  // assert that logged and remaining time has been cleared
  cy.contains(`${loggedTimeValue}${RegisteredLoggedTimetxt}`).should(
    "not.exist"
  );
  cy.contains(`${remainingTimeValue}${RegisteredRemainingTimetxt}`).should(
    "not.exist"
  );
  cy.contains(`${EstimatedTimeValue}${RegisteredEstimatedTimetxt}`).should(
    "be.visible"
  );
  cy.contains(NoTimeField).should("be.visible");
}
