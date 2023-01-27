import { Box, FormControlLabel, FormGroup, Grid, Paper, Switch, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks"
import { loadData, selectCategories, selectIngredientsCatalog, selectIngredientsStatus } from "../app/store/ingredientSlice"
import IngredientCard from "./ingredient/IngredientCard.component";
import SearchBox from "./ingredient/SearchBox.component";

const IngredientsPage = () => {
    const catalogMaster = useAppSelector(selectIngredientsCatalog);
    const [catalog, setCatalog] = useState(catalogMaster)
    const categories = useAppSelector(selectCategories);
    const status = useAppSelector(selectIngredientsStatus);
    const [tableDisplay, setTableDisplay] = useState(false);
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const lowerCaseTerm = term.toLowerCase();
        setCatalog(catalogMaster.filter((item) => {
            const lowerCaseName = item.Name.toLowerCase().replace(/[^a-zA-Z0-9]/g,"");
            return lowerCaseName.includes(lowerCaseTerm)
        }))
    }

    useEffect(() => {
        dispatch(loadData())
    },[])

    useEffect(() => {
        handleSearch(searchTerm)
    },[catalogMaster])

    const CardDisplay = () => {
        return(
            <>
                {categories.map(category => 
                    (<Paper sx={{
                            m:2, 
                            p:3, 
                            background:category.ColorHex?category.ColorHex:'#dcdcdc'
                        }} 
                        key={category.CategoryID} 
                        elevation={2}
                        >
                        <Typography 
                            gutterBottom
                            variant="h4" 
                            align="center"
                            >{category.Name}</Typography>
                        <Grid container spacing={3}>
                            {catalog.map( ingredient => 
                                ingredient.CategoryID === category.CategoryID? (
                                    <Grid key={ingredient.IngredientID} item xs={12} sm={6} md={4} lg={3} xl={2}>
                                        <IngredientCard
                                            key={ingredient.IngredientID} 
                                            {...ingredient}
                                            />
                                    </Grid>
                                    )
                                    :null
                            )}
                        </Grid>
                    </Paper>)
                    
                )}
            </>
        )}
    
    const TableDisplay = () => {
      
        const rows: GridRowsProp = 
            catalog
        
        const rowHeight = 40;
        const tableHeight = rows.length * rowHeight + 75 + 35 // rows * rowHeight + Title buffer + export button buffer
        
        const columns: GridColDef[] = [
            { field: 'Name', headerName: 'Name', width: 150 },
            { field: 'Category', headerName: 'Category', width: 100},
            { field: 'PortionCost', headerName: 'Portion Cost', width: 100, valueFormatter: (({value}) => `$ ${value.toFixed(2)}`)},
            { field: 'CasePrice', headerName: 'Case Price', width: 100},
            { field: 'CaseSize', headerName: 'Case Total', width: 100},
            { field: 'Unit', headerName: 'Unit', width: 100},
            { field: 'YieldPercent', headerName: 'Yield %', width: 100},
            { field: 'PortionsPerCase', headerName: 'Per Case', width: 100},
        ];
        function CustomToolbar() {
            const csvOptions={
                fileName: "Ingredients Data"
            }
            return (
                <GridToolbarContainer>
                    <GridToolbarExport 
                        csvOptions={csvOptions}
                        printOptions={{disableToolbarButton: true }}
                        />
                </GridToolbarContainer>
            )
        }

        return (
            <div style={{height:tableHeight, width:'100%'}}>
                <DataGrid 
                    getRowId={row => row.IngredientID}
                    rows={rows} 
                    columns={columns} 
                    components={{Toolbar: CustomToolbar}}
                    rowHeight={rowHeight}
                    hideFooter={true}
                    />
            </div>
        )
    }
    
    return(
        <>
            <SearchBox searchTerm={searchTerm} handleSearch={handleSearch} />
            {/* <TextField 
                placeholder="search" 
                variant="outlined" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                ></TextField> */}
            <Box component="form" sx={{'& > :not(style)' : {m:1, width: '25ch'},}}>
                <FormGroup >
                    <FormControlLabel control={
                    <Switch
                        aria-label="toggle table display" 
                        checked={tableDisplay} 
                        onClick={() => setTableDisplay(!tableDisplay)}
                        />} label={tableDisplay?"Table View":"Card View"} />
                </FormGroup>
            </Box>

            {tableDisplay?
                <TableDisplay />
                :
                <CardDisplay />
            }
        </>
    )
}

export default IngredientsPage