import { Outlet } from "react-router-dom";
export default function TemplateAuthForm({ title }: { title: string }) {
  return (
    <div
      className="
        flex flex-col
        min-h-screen
        py-2
        bg-primary
        items-center
      "
    >
      <h1>{title}</h1>
      <div
        className="
          flex flex-col
          mt-6 p-4
          w-4/5
          bg-grey
          border-[1px] rounded-lg
          shadow-md
          items-center justify-center
        "
      >
        <Outlet />
      </div>
    </div>
  );
}
