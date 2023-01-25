import { GridRowsProp, GridColDef, DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid"
import { TemplateNutrition } from "../../types/Recipe.types"

interface NutritionDetailsProps {
    templates: TemplateNutrition[];
    Name: string;
}

const NutritionDetailsPane: React.FC<NutritionDetailsProps> = (props) => {
    // Data Grid Setup
    const rows: GridRowsProp = 
        props.templates.map((row) => ({id: row.TemplateID, ...row}))
    
    const rowHeight = 40;
    const tableHeight = rows.length * rowHeight + 75 + 35 // rows * rowHeight + Title buffer + export button buffer
    
    const columns: GridColDef[] = [
        { field: 'Template', headerName: 'Name', width: 150 },
        { field: 'Price', headerName: 'Cost', width: 100, valueFormatter: (({value}) => `$ ${value}`)},
        { field: 'Calories', headerName: 'Calories', width: 100 },
        { field: 'TTLFat', headerName: 'TTL Fat (g)', width: 100 },
        { field: 'SatFat', headerName: 'Sat Fat (g)', width: 100 },
        { field: 'Cholesterol', headerName: 'Choles (mg)', width: 100 },
        { field: 'Sodium', headerName: 'Sodium (mg)', width: 100 },
        { field: 'Carbohydrates', headerName: 'Carb (g)', width: 100 },
        { field: 'Fiber', headerName: 'Fiber (g)', width: 100 },
        { field: 'Sugar', headerName: 'Sugar (g)', width: 100 },
        { field: 'Protein', headerName: 'Protein (g)', width: 100 },
    ];
    function CustomToolbar() {
        const csvOptions={
            fileName: `${props.Name} Nutrition Information`
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
                rows={rows} 
                columns={columns} 
                components={{Toolbar: CustomToolbar}}
                rowHeight={rowHeight}
                hideFooter={true}
                />
        </div>
    )
}

export default NutritionDetailsPane