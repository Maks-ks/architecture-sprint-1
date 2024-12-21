import React, { lazy }  from "react";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({ cards }) {
  const currentUser = React.useContext(CurrentUserContext);

  const Profile = lazy(() => import('profile_microfrontend/Profile').catch(() => {
    return { default: () => <div className='error'>Profile component is not available!</div> };
   })
   );
  
   const Places = lazy(() => import('places_microfrontend/Places').catch(() => {
    return { default: () => <div className='error'>Places component is not available!</div> };
   })
   ); 

  return (
    <main className="content">
      <Profile currentUser></Profile>
      <Places cards></Places>
    </main>
  );
}

export default Main;
