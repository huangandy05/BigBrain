import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditGameName from '../components/EditGameName';
import Register from '../pages/Register';
import { BrowserRouter } from 'react-router-dom';
import SessionPopup from '../components/SessionPopup';
import PlayJoin from '../pages/PlayJoin';

describe('<Register>', () => {
  it('renders the name, email and password fields and register and log in buttons', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Register/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });

  it('renders an alert on empty inputs when register button is pressed', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    userEvent.click(screen.getByRole('button', { name: /Register/i }));
    expect(
      screen.getByText(/Please provide an email and password./i)
    ).toBeInTheDocument();
  });

  it('renders an alert on an invalid name', () => {
    const inputs = {
      name: '3lon musk',
      email: 'betty@email.com',
      password: 'cardigan',
    };

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    userEvent.type(screen.getByLabelText(/Name/i), inputs.name);
    userEvent.type(screen.getByLabelText(/Email/i), inputs.email);
    userEvent.type(screen.getByLabelText(/Password/i), inputs.password);
    userEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(screen.getByText(/Please provide a valid name/)).toBeInTheDocument();
  });

  it('renders an alert on an invalid email', () => {
    const inputs = {
      name: 'Elon musk',
      email: 'betty@email.',
      password: 'cardigan',
    };

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    userEvent.type(screen.getByLabelText(/Name/i), inputs.name);
    userEvent.type(screen.getByLabelText(/Email/i), inputs.email);
    userEvent.type(screen.getByLabelText(/Password/i), inputs.password);
    userEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(
      screen.getByText(/Please provide a valid email address./)
    ).toBeInTheDocument();
  });
});

describe('<EditGameName>', () => {
  it('renders the correct quiz title text and edit button', () => {
    render(<EditGameName title="yeehaw" />);
    expect(screen.getByRole('button', { name: /yeehaw/i })).toBeInTheDocument();
  });

  it('opens an edit dialog when the title button is pressed', () => {
    render(<EditGameName title="yeehaw" />);
    userEvent.click(screen.getByRole('button', { name: /yeehaw/i }));

    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Quiz title/i)).toBeInTheDocument();
  });

  it("closes edit dialog and doesn't change title when cancel button is pressed", () => {
    render(<EditGameName title="yeehaw" />);
    userEvent.click(screen.getByRole('button', { name: /yeehaw/i }));

    userEvent.type(
      screen.getByLabelText(/Quiz title/i),
      'Different quiz title'
    );
    userEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(screen.getByText(/yeehaw/i)).toBeInTheDocument();
  });

  it('closes edit dialog and changes title when save button is pressed', () => {
    render(<EditGameName title="yeehaw" />);
    userEvent.click(screen.getByRole('button', { name: /yeehaw/i }));

    userEvent.type(
      screen.getByLabelText(/Quiz title/i),
      'Different quiz title'
    );
    userEvent.click(screen.getByRole('button', { name: /Save/i }));

    expect(screen.getByText(/Different quiz title/i)).toBeInTheDocument();
  });
});

describe('<SessionPopup>', () => {
  it('displays the correct session id and buttons', () => {
    render(
      <BrowserRouter>
        <SessionPopup sessionID={123321} open={true} />
      </BrowserRouter>
    );
    expect(screen.getByText(/123321/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/copy-link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Game Controls/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Close/i)).toBeInTheDocument();
  });

  it('correctly closes when the close button is pressed', () => {
    render(
      <BrowserRouter>
        <SessionPopup sessionID={123321} open={true} />
      </BrowserRouter>
    );
    userEvent.click(screen.getByLabelText(/Close/i));
    expect(() => screen.getByRole('button', { name: /Close/i })).toThrow;
    expect(() => screen.getByRole('button', { name: /Game Controls/i }))
      .toThrow;
  });
  // Can't do copy button tests because 'writeText' not recognised in testing suite
  // it("correctly renders an alert when the copy button is pressed", () => {
  //   render(
  //     <BrowserRouter>
  //       <SessionPopup sessionID={123321} open={true} />
  //     </BrowserRouter>
  //   );
  //   userEvent.click(screen.getByLabelText(/copy-link/i));

  //   expect(screen.getByText(/Link Copied/i)).toBeInTheDocument();

  // });
});

describe('<PlayJoin>', () => {
  it('renders the session ID and name inputs and join button', () => {
    render(
      <BrowserRouter>
        <PlayJoin />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Session ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Join/i })).toBeInTheDocument();
  });
});
