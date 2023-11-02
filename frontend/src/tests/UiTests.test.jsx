// Couldn't get Cypress to work - but this is the pseudo-code

context('Happy path', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('Happy path Success', () => {
    const name = 'Handy Wang';
    const email = 'handy@wang.com';
    const password = 'yeehaw';

    // Move to register
    cy.get('button[name=register]').click();

    // Register account
    cy.get('input[name=name]').focus().type(name);
    cy.get('input[name=email]').focus().type(email);
    cy.get('input[name=password]').focus().type(password);
    cy.get('button[name="register"]').click();

    // Make new game
    cy.get('input[name=Enter game name').focus().type('New game');
    cy.get('button[name=Create Game').click();

    // Start game
    cy.get('button[name=Start Game').click();
    // Close popup
    cy.get('button[name=Close').click();
    // Stop game
    cy.get('button[name=Stop').click();

    // Click 'yes' on stop popup
    cy.get('button[name=Yes').click();

    // Go back to dashboard via nav bar
    cy.get('button[name=Dashboard').click();

    // Logout
    cy.get('button[name=Logout').click();

    // Login
    cy.get('input[name=email]').focus().type(email);
    cy.get('input[name=password]').focus().type(password);
    cy.get('button[name="login"]').click();
  });
});
