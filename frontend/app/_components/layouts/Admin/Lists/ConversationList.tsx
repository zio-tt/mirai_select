import { List, ListProps, Datagrid, TextField } from 'react-admin'

export const ConversationList = (props: ListProps) => (
  <List {...props}>
    <Datagrid rowClick='edit'>
      <TextField source='id' />
      <TextField source='decision_id' />
      <TextField source='user_decision' />
      <TextField source='query_text' />
      <TextField source='created_at' />
      <TextField source='updated_at' />
    </Datagrid>
  </List>
)
