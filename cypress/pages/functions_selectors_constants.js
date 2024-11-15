export const TimeField = 'input[placeholder="Number"]';
export const NoTimeField = "No time logged";
export const RegisteredEstimatedTimetxt = "h estimated";
export const TimeModal = '[data-testid="modal:tracking"]';
export const StopWatchButton = '[data-testid="icon:stopwatch"]';
export const RegisteredLoggedTimetxt = "h logged";
export const RegisteredRemainingTimetxt = "h remaining";

export function createissue() {
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="select-option:Story"]').click();
    cy.get(".ql-editor").type(
      "User can add and modify estimated time of issue"
    );
    cy.get('input[name="title"]').type("Time tracking assignment");
    cy.get('[data-testid="select:userIds"]').click();
    cy.get('[data-testid="select-option:Pickle Rick"]').click();
    cy.get('button[type="submit"]').click();
  });
  cy.contains("Issue has been successfully created.").should("be.visible");
  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .wait(10000)
    .contains("Time tracking assignment")
    .click();
}
