import { Route, Routes } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Shell from './pages/Shell';
import ChatView from './pages/ChatView';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Shell />}>
          <Route index element={<ChatView />} />
          <Route path="chat/:sessionId" element={<ChatView />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
