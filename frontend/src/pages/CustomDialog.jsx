import {Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
const CustomDialog=(props)=>{
  const handleClose= props.handleClose
  const selectedItemId= props.selectedItemId
  const handleDelete= props.handleDelete
  const dialog_title= props.dialog_title
  const open= props.open
  const selectedItemType= props.selectedItemType
  //console.log("props>>>",props);
  return(
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiPaper-root': {
             backgroundColor: 'rgba(240, 255, 255, 0.897)',
            borderRadius: '5px',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: "black" }}>
          {/* {"This item will be removed from your recentlyViewed"} */}
          {dialog_title}
        </DialogTitle>
        <DialogActions>
          <Button variant='outlined' sx={{ borderColor: 'blue', color: 'blue', mb: '15px' }} onClick={handleClose}>Cancel</Button>
          <Button variant='outlined' sx={{ color: 'red', borderColor: 'red', mb: '15px' }} onClick={() => handleDelete(selectedItemId, selectedItemType)} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
  )
}
export default CustomDialog;