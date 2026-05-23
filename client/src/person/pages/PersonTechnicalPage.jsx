import { usePersonContext } from 'person/PersonContext';
import Checkmark from 'shared/Checkmark';
import TagList from 'tag/components/TagList';

const SHARE_LEVEL_LABELS = {
  0: 'not shared',
  1: 'restricted',
  2: 'public',
};

export default function PersonTechnicalPage() {
  const { person } = usePersonContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">share level</h3>
      <div className="flex items-center gap-3">
        <Checkmark value={person.sharing} />
        <span>{SHARE_LEVEL_LABELS[person.shareLevel]}</span>
      </div>
      <h3 className="text-lg font-bold">tags</h3>
      <TagList tags={person.tags} />
      {person.tags.length === 0 && <p>none</p>}
      <h3 className="text-lg font-bold">record created</h3>
      <p>{person.createdAt}</p>
      <h3 className="text-lg font-bold">record updated</h3>
      <p>{person.updatedAt}</p>
      <p className="italic">
        Note about "created at": If I had a "test" person that was no longer
        needed, I sometimes repurposed them later instead of deleting them. So
        the creation date of a given person could be earlier than when I
        actually began researching that person.
      </p>
    </div>
  );
}
