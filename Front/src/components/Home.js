import React from "react";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className="container">
        <div className="justify-content-center">
          <div className="image-home"></div>
          <div className="text-home">
            Merci d’avoir participé à cette phase. Nous vous ferons un retour
            sur les résultats obtenus concernant la performance du prototype.
            Vos commentaires sont toujours les bienvenues ! Merci de nous
            contacter sur romain.farel@dgmail.fr
          </div>
          <NavLink to="/">
            <button type="button" className="button-home">
              Retour
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Home;
