import { useState, useEffect } from "react";
import personsService from "./services/persons";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber,
    };
    const personToCheck = persons.find((p) => p.name === newName);
    if (persons.some(() => personToCheck)) {
      if (
        window.confirm(
          `${personToCheck.name} is already existed. Do you want to update with new info?`
        )
      ) {
        // update person
        personsService
          .update(personToCheck.id, nameObject)
          .then((returnedPersons) => {
            setPersons(
              persons.map((person) =>
                person.id !== personToCheck.id ? person : returnedPersons
              )
            );
            setNewName("");
            setNewNumber("");
            setAlertMessage({
              message: `'${personToCheck.name}' has been updated`,
              type: "success",
            });
            setTimeout(() => {
              setAlertMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setAlertMessage({
              message: error.response.data.error,
              type: "error",
            });
            setTimeout(() => {
              setAlertMessage(null);
            }, 5000);
            //setPersons(persons.filter((p) => p.id !== personToCheck.id));
          });
      }
      return;
    } else {
      // add person
      personsService
        .create(nameObject)
        .then((returnedPersons) => {
          setPersons(persons.concat(returnedPersons));
          setNewName("");
          setNewNumber("");
          setAlertMessage({
            message: `'${nameObject.name}' has been added`,
            type: "success",
          });
          setTimeout(() => {
            setAlertMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setAlertMessage({
            message: error.response.data.error,
            type: "error",
          });
          setTimeout(() => {
            setAlertMessage(null);
          }, 5000);
        });
    }
  };

  const removePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Are you sure to remove ${person.name}?`)) {
      personsService.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
      setAlertMessage({
        message: `'${person.name}' has been removed from the phone book`,
        type: "success",
      });
      setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
    }
  };

  const personsToShow = newFilter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      )
    : persons;

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={alertMessage?.message} type={alertMessage?.type} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h3>Add new contact</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} removePerson={removePerson} />
    </div>
  );
};

const PersonForm = ({
  onSubmit,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);
const Persons = ({ personsToShow, removePerson }) => (
  <div>
    {personsToShow.map((person) => (
      <div key={person.id}>
        {person.name} {person.number}{" "}
        <button onClick={() => removePerson(person.id)}>x</button>
      </div>
    ))}
  </div>
);
const Filter = ({ value, onChange }) => (
  <div>
    filter shown with <input value={value} onChange={onChange} />
  </div>
);

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={type}>{message}</div>;
};
export default App;
