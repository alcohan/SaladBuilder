import { Search } from '@mui/icons-material';
import { InputBase, Paper } from '@mui/material';
import { FC } from 'react';

interface SearchBoxProps {
    searchTerm: string;
 handleSearch: (term: string) => void;
}
const SearchBox: FC<SearchBoxProps> = ({searchTerm, handleSearch}) => {

  return (
    <Paper sx={{display: 'flex', alignItems: 'center', width: 400}}>
      <InputBase
        sx={{marginLeft:'1 rem', flex: 1}}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
        onChange={(e) => handleSearch(e.target.value)}
        value={searchTerm}
      />
    <Search />
    </Paper>
  );
}

export default SearchBox;