import { BrowserRouter } from 'react-router-dom';
import Router from '@/providers/routes/routes';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Router />
    </BrowserRouter>
  );
}

export default App;
