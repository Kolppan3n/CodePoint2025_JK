import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="grid grid-cols-3 grid-rows-3">
        <Link
          to="/varaukset"
          className="col-start-2 rotate-135 bg-primary rounded-bl-full rounded-br-full rounded-tl-full w-40 h-40 flex justify-center items-center text-xl"
        >
          <p className="-rotate-135">Varaukset</p>
        </Link>
        <Link
          to="/tilat"
          className="row-start-2 rotate-45 bg-primary rounded-bl-full rounded-br-full rounded-tl-full w-40 h-40 flex justify-center items-center text-xl"
        >
          <p className="-rotate-45">Tilat</p>
        </Link>
        <Link
          to="/varaajat"
          className="col-start-3 row-start-2 rotate-225 bg-primary rounded-bl-full rounded-br-full rounded-tl-full w-40 h-40 flex justify-center items-center text-xl"
        >
          <p className="-rotate-225">Varaajat</p>
        </Link>
        <Link
          to={localStorage.getItem("authToken") ? "/logout" : "/login"}
          className={`col-start-2 row-start-3 rotate-315 ${localStorage.getItem("authToken") ? "bg-primary" : "bg-secondary"} rounded-bl-full rounded-br-full rounded-tl-full w-40 h-40 flex justify-center items-center text-xl`}
        >
          {localStorage.getItem("authToken") ? <p className="-rotate-315 text-center">Kirjaudu<br/>Ulos</p> : <p className="-rotate-315">Kirjaudu</p>}
        </Link>
      </div>
    </div>
  );
};

export default Home;
