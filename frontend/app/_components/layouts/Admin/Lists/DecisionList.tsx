import { List, ListProps, Datagrid, TextField, EmailField } from 'react-admin';

export const DecisionList = (props: ListProps) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="user_id" />
      <TextField source="public" />
      <TextField source="created_at" />
      <TextField source="updated_at" />
    </Datagrid>
  </List>
);