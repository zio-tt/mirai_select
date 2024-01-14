import { List, ListProps, Datagrid, TextField, EmailField } from 'react-admin';

export const CommentList = (props: ListProps) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="user_id" />
      <TextField source="decision_id" />
      <TextField source="content" />
      <TextField source="created_at" />
      <TextField source="updated_at" />
    </Datagrid>
  </List>
);