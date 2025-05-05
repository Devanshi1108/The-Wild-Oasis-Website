import SpinnerMini from "../_components/SpinnerMini";

function loading() {
  return (
    <div className="grid items-center justify-center">
      <SpinnerMini />
      <p className="text-xl text-primary-200">Loading cabin data..</p>
    </div>
  );
}

export default loading;
