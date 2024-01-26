import { List, ListProps, Datagrid, TextField, EmailField, EditButton } from 'react-admin';

export const UserList = (props: ListProps) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="token" />
      <TextField source="created_at" />
      <TextField source="updated_at" />
      <EditButton />
    </Datagrid>
  </List>
);