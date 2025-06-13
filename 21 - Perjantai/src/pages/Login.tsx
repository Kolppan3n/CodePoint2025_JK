import CustomButton from "../components/CustomButton";
import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { useForm, type SubmitHandler } from "react-hook-form";

const Login = () => {
  type FormFields = {
    tunnus: string;
    salasana: string;
  };

  const { isAuthenticated, login, error } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log("Form submitted:", data);
    try {
      await login(data);
      if(!isAuthenticated) {
        throw new Error("Kirjautuminen epäonnistui");
      }
    } catch (subError: any) {
      console.error("Login.tsx", subError.message);
      console.error("AuthProvider.tsx", error);
      setError("root", { message: error || "Kirjautuminen epäonnistui" });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col bg-foreground rounded-2xl p-10 shadow-md min-w-xl"
        >
          <h3 className="text-center text-4xl mb-6">Kirjautuminen</h3>
          <label className="mb-1">Tunnus</label>
          <input
            type="email"
            {...register("tunnus", {
              required: "Käyttäjätunnus on pakollinen",
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            className="mb-2 border-zinc-500 border-1 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:shadow-lg focus:border-transparent focus:ring-primary"
          />
          <label className="mb-1">Salasana</label>
          <input
            type="password"
            {...register("salasana", {
              required: "Salasana on pakollinen",
              minLength: {
                value: 8,
                message: "Salasanan tulee olla vähintään 8 merkkiä pitkä",
              },
            })}
            className="mb-6 border-zinc-500 border-1 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:shadow-lg focus:border-transparent focus:ring-primary"
          />
          <input
            type="submit"
            disabled={isSubmitting}
            value={isSubmitting ? "Kirjaudutaan..." : "Kirjaudu"}
            className="mb-2 bg-primary p-1 rounded-md cursor:pointer hover:bg-primary/80 transition-colors duration-200"
          />
          {errors.root && (
            <p className="text-error text-center mt-2">{errors.root.message}</p>
          )}
        </form>
      )}
      <CustomButton type="Return" disabled={isSubmitting} />
    </div>
  );
};

export default Login;
