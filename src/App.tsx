import Header from "./components/Header";
import Picker from "./components/Picker";
import Queue from "./components/Queue";

function App() {


  return (
    <div className="container mx-auto">
        <Header/>
      <div className="grid grid-cols-2 gap-4">
        <div>
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
        </div>
        <Queue
          items={[]}
        />
      </div>
    </div>

  );
}

export default App;
