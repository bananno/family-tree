import NewPersonModal from 'person/components/NewPersonModal';
import PeopleTable from 'person/components/PeopleTable';
import PersonList from 'person/components/PersonList';
import usePeople from 'person/hooks/usePeople';
import AdminOnly from 'session/AdminOnly';
import useSessionContext from 'session/useSessionContext';
import Filter from 'shared/Filter';
import Spacer from 'shared/Spacer';

const filterId = 'FILTER_PEOPLE_PAGE_TABLE';

export default function PeopleIndexPage() {
  const { people, isLoading } = usePeople({ filterId });
  const { currentUser } = useSessionContext();

  return (
    <>
      <h1>People</h1>
      <AdminOnly>
        <NewPersonModal />
        <Spacer />
      </AdminOnly>
      <Filter filterId={filterId} />
      {isLoading && <p>loading...</p>}
      {currentUser?.admin ? (
        <PeopleTable people={people} />
      ) : (
        <PersonList people={people} />
      )}
    </>
  );
}
