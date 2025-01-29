import { useRouteError } from "react-router-dom";
import "./moduledCSS/404.css";
//import '../App.css'
import { useEffect } from "react";

function ErrorPage() {
    
    const error = useRouteError();
    console.log(error);
    useEffect(() => {
        const preventZoom = (event) => {
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
          }
        };
        document.addEventListener("wheel", preventZoom, { passive: false });
        document.addEventListener("keydown", preventZoom, { passive: false });
        return () => {
          document.removeEventListener("wheel", preventZoom);
          document.removeEventListener("keydown", preventZoom);
        };
      }, []);
    
 

    return (
        <div id="error-page">
          {
          }
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}

export default ErrorPage;