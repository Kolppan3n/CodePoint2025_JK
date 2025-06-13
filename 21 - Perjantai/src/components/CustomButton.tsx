import { Link } from "react-router-dom";

type buttonParams = {
  type: "Return" | "Dialog";
  disabled?: boolean | null;
  text?: string
  click?: () => void
};

const CustomButton = ({ type, text, disabled, click }: buttonParams) => {
    if (type === "Return"){
      return (
        <Link to="/" onClick={disabled ? (e) => e.preventDefault() : undefined} className="text-center text-xl bg-secondary rounded-xl px-5 py-3 m-auto">Takaisin</Link>
      );
    }
    if (type === "Dialog"){
      return (
        <button disabled={!!disabled} onClick={click} className="text-center text-xl bg-primary rounded-xl px-5 py-3 m-auto cursor-pointer">{text}</button>
      );
    }
    else {
      return (
        <p className="w-20 bg-error rounded-xl px-2 py-1">Error: Undefined</p>
      );
    }
};

export default CustomButton;
