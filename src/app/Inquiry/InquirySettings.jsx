import React, { useEffect, useState } from 'react'
import { collection, addDoc, getDoc, onSnapshot, doc, query } from "firebase/firestore";
import { db } from '@/firebase-config';  // Import your Firebase configuration
import GuideData from './GuideData';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import RadioButton from './RadioButton';
import ModifyCategory from './ModifyCategory';
import Modal from 'react-modal'
import { DataGrid, GridActionsCellItem, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const InquirySettings = () => {
    const [guideData, setGuideData] = useState([])
    const [showCategory, setShowCategory] = useState(false)
    const [parameters, setParameters] = useState({})

    const columns = [
        { field: 'header', headerClassName: 'header', headerName: 'Recipient', flex: 0.5},
        { field: 'email', headerClassName: 'header', headerName: 'Email', flex: 0.5},
      ]
    
    useEffect(() => {
        const q = query(collection(db, "inquirySettings"));
        
        const unsub = onSnapshot(q, (querySnapshot) => {
            const GuideData = [];
            querySnapshot.forEach((doc) => {
                GuideData.push(doc.data());
            });
            console.log(GuideData)
            setGuideData(GuideData);
        });
        console.log(guideData)
        return () => unsub();
    }, []);

    const rowclickhandler = (params) => {
      setParameters(params.row)
      setShowCategory(true)
    }
    

  return (
    <div>
      <CategoryBox isOpen={showCategory} setIsOpen={setShowCategory} params={parameters}/>
      <div>
        <DataGrid
          rows={guideData}
          onRowClick={rowclickhandler}
          columns={columns}
          sx={{
          '& .header' : {
              fontWeight: 'bold',
          },
          '& .rows' : {
              '&:hover' : { backgroundColor: '#115E59', color: 'white', cursor: 'pointer'}
          }
          }}
          getRowClassName={(params) => 'rows'}
          initialState={{
          pagination: {
              paginationModel: { page: 0, pageSize: 20 },
          },
          }}
          pageSizeOptions={[10, 20]}
          disableRowSelectionOnClick
          />
        </div>
      </div>
  )
}

const CategoryBox = ({params, isOpen, setIsOpen}) => {
  const customStyles = {
    content: {
      borderRadius: '10px', 
      width: '50%',
      height: '80%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#FFFFFF',
    },
    overlay:{
      backgroundColor: "rgba(0, 0, 0, 0.5)"

    }
  };


  return (
    <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false)} style={customStyles}>
          <ModifyCategory setIsOpen={setIsOpen} category={params}/>
    </Modal>
  ) 
}

export default InquirySettings
