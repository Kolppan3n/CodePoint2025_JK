import { useRef, useState } from "react";
import CustomButton from "./CustomButton";
import type { Tila, Varaaja } from "../utils/Types";

type DialogParams = {
  resource: "Tilat" | "Varaajat" | "Varaukset";
  createRow: (postData: object) => void;
  text: string;
  tilat?: Tila[];
  varaajat?: Varaaja[];
};

const DialogForm = ({
  resource,
  text,
  createRow,
  tilat,
  varaajat,
}: DialogParams) => {
  const initValues =
    resource != "Varaukset"
      ? { nimi: "" }
      : {
          tila: 0,
          varaaja: 0,
          varauspaiva: new Date().toISOString().split("T")[0],
        };

  const [postData, setPostData] = useState(initValues);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dialogRef.current?.close();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let submitValue = value;
    if (name == "varauspaiva")
      submitValue = new Date(value).toISOString().split("T")[0];
    setPostData((prevState) => ({ ...prevState, [name]: submitValue }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(postData);
    try {
      createRow(postData);
      setPostData(initValues);
      dialogRef.current?.close();
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <>
      <CustomButton type="Dialog" click={openDialog} text={text} />
      <dialog
        ref={dialogRef}
        className="m-auto rounded-md bg-foreground text-white shadow-xl border-2 border-background backdrop:bg-black/75"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col px-8 py-4 items-center gap-6"
        >
          <h2 className="text-xl">{text}</h2>
          {resource != "Varaukset" ? (
            <input
              required
              type="text"
              name="nimi"
              value={postData.nimi}
              onChange={handleChange}
              placeholder={`${resource.substring(
                0,
                resource.length - 1
              )}n nimi...`}
              className="border-zinc-500 border-1 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:shadow-lg focus:border-transparent focus:ring-primary"
            />
          ) : (
            <>
              <select
                required
                id="tila"
                name="tila"
                value={postData.tila}
                onChange={handleChange}
                className="border-zinc-500 border-1 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:shadow-lg focus:border-transparent focus:ring-primary w-full"
              >
                {tilat?.map((tila: Tila) => (
                  <option key={tila.nimi} value={tila.id} className="bg-foreground">
                    {tila.nimi}
                  </option>
                ))}
              </select>
              <select
                required
                id="varaaja"
                name="varaaja"
                value={postData.varaaja}
                onChange={handleChange}
                className="border-zinc-500 border-1 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:shadow-lg focus:border-transparent focus:ring-primary w-full"
              >
                {varaajat?.map((varaaja: Varaaja) => (
                  <option key={varaaja.nimi} value={varaaja.id} className="bg-foreground">
                    {varaaja.nimi}
                  </option>
                ))}
              </select>
              <input
                required
                type="date"
                name="varauspaiva"
                className="border-stone-500 border-1 rounded-md text-black py-1 px-2 focus:outline-none focus:ring-2 focus:shadow-lg focus:border-transparent focus:ring-[#ff9fba] w-full invert"
              />
            </>
          )}
          <div className="flex w-full gap-4">
            <button
              onClick={(e) => closeDialog(e)}
              className="bg-error flex-1 py-1 rounded-md hover:bg-error/75 cursor-pointer"
            >
              Sulje
            </button>
            <input
              type="submit"
              className="bg-primary flex-1 py-1 rounded-md hover:bg-primary-dark cursor-pointer"
            ></input>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default DialogForm;
