import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const stripePromise = loadStripe('pk_test_51PDjD5LlnJgL5SmXtPiudeWRtZSJ5S7C9SZ2JbBu2C7AsnOu4FhWKgu6CTqNXsBRz9TCtKEaySt1bEsD3iE5ZakQ00iOBakOLJ');



const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
   
  </React.StrictMode>
);
// }) ()



