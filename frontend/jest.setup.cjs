require('@testing-library/jest-dom');

jest.mock('react-transition-group', () => {
	const FakeTransition = ({ children }) => children;
	const FakeCSSTransition = ({ children }) => children;
	return {
		__esModule: true,
		Transition: FakeTransition,
		CSSTransition: FakeCSSTransition,
		TransitionGroup: ({ children }) => children,
	};
});

process.env.MUI_DISABLE_RIPPLE = 'true';
