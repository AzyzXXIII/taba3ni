// ✅ Props type
type EmptyProps = {
  resourceName: string;
};

// ✅ Component with typed props
function Empty({ resourceName }: EmptyProps) {
  return <p>No {resourceName} could be found.</p>;
}

export default Empty;
