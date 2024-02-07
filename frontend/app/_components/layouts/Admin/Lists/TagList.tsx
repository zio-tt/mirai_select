import { List, ListProps, Datagrid, TextField } from 'react-admin'

export const TagList = (props: ListProps) => (
  <List {...props}>
    <Datagrid rowClick='edit'>
      <TextField source='id' />
      <TextField source='name' />
      <TextField source='created_at' />
      <TextField source='updated_at' />
    </Datagrid>
  </List>
)
