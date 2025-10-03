import { FC } from 'react';

import DefaultLayout from './layouts/DefaultLayout';
import { TodoProviderContext } from './context/todo/todoContex';
import TodoView from './views/TodoView';

const App: FC = () => {
  return (
    <TodoProviderContext>
      <DefaultLayout>
        <TodoView />
      </DefaultLayout>
    </TodoProviderContext>
  );
};

export default App;
