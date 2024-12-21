import React, { lazy }  from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { CurrentUserContext } from "./contexts/CurrentUserContext";

import { Route, BrowserRouter, useHistory, Switch } from "react-router-dom";

import "./index.css";

const Login = lazy(() => import('auth_microfrontend/Login').catch(() => {
  return { default: () => <div className='error'>Login component is not available!</div> };
 })
 );

 const Register = lazy(() => import('auth_microfrontend/Register').catch(() => {
  return { default: () => <div className='error'>Register component is not available!</div> };
 })
 ); 

const App = () =>
  {
    const history = useHistory();
    
    const [email, setEmail] = React.useState("");
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
 
    const handleOnLogin = event => { 
      setEmail(event.detail.email);
      setIsLoggedIn(true);
      history.push("/");
    }

    const handleOnRegister = event => { 
      setTooltipStatus("success");
      setIsInfoToolTipOpen(true);
      history.push("/signin");
    }

    const handleOnCheckToken = event => { 
      setTooltipStatus("success");
      setIsInfoToolTipOpen(true);
      history.push("/signin");
    }
  
    useEffect(() => {
      addEventListener("OnLogin", handleOnLogin);
      return () => removeEventListener("OnLogin", handleOnLogin) 
    }, []);

    useEffect(() => {
      addEventListener("OnRegister", handleOnRegister);
      return () => removeEventListener("OnRegister", handleOnRegister) 
    }, []);

    useEffect(() => {
      addEventListener("OnCheckToken", handleOnCheckToken);
      return () => removeEventListener("OnCheckToken", handleOnCheckToken) 
    }, []);


    React.useEffect(() => {
      const token = localStorage.getItem("jwt");
      if (token) {
        auth
          .checkToken(token)
          .then((res) => {
            setEmail(res.data.email);
            setIsLoggedIn(true);
            history.push("/");
          })
          .catch((err) => {
            localStorage.removeItem("jwt");
            console.log(err);
          });
      }
    }, [history]);

    function onSignOut() {
      // при вызове обработчика onSignOut происходит удаление jwt
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
      // После успешного вызова обработчика onSignOut происходит редирект на /signin
      history.push("/signin");
    }

 return <CurrentUserContext.Provider value={currentUser}>
  <div className="page__content">
  <Header email={email} onSignOut={onSignOut} />
  <Switch>
    <ProtectedRoute
      exact
      path="/"
      component={Main}
      cards={cards}
      onEditProfile={handleEditProfileClick}
      onAddPlace={handleAddPlaceClick}
      onEditAvatar={handleEditAvatarClick}
      onCardClick={handleCardClick}
      onCardLike={handleCardLike}
      onCardDelete={handleCardDelete}
      loggedIn={isLoggedIn}
    />
    <Route path="/signup">
      <Register />
    </Route>
    <Route path="/signin">
      <Login />
    </Route>
  </Switch>
  <Footer />
</div>
</CurrentUserContext.Provider>
  };

const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<BrowserRouter>
  <App />
</BrowserRouter>)