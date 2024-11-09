import { BrowserRouter } from 'react-router-dom';
import Router from '@/providers/routes/routes';

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
