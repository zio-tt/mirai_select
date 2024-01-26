import { List, ListProps, Datagrid, EditButton, TextField } from 'react-admin';

const CharacterList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="mbti_type" />
        <TextField source="tone" />
        <TextField source="first_person" />
        <TextField source="second_person" />
        <TextField source="expression" />
        <TextField source="values" />
        <TextField source="empathy" />
        <TextField source="character1_welcome" />
        <TextField source="character2_welcome" />
        <TextField source="created_at" />
        <TextField source="updated_at" />
        <TextField source="avatar_url" />
        <EditButton />
      </Datagrid>
    </List>
  );
}

export { CharacterList }