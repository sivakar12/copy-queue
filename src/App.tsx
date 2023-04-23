import Header from "./components/Header";
import Picker from "./components/Picker";
import Queue from "./components/Queue";

function App() {


  return (
    <div>
      <Header/>
      <Picker
        onChange={() => {}}
        label="source"
        value="/"
        directoryOnly={false}
      />
      <Picker
        onChange={() => {}}
        label="destination"
        value="/"
        directoryOnly={true}
      />
      <Queue
        items={[]}
      />
    </div>

  );
}

export default App;
