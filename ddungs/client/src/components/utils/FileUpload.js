import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd';
import axios from 'axios'; //front -> back

function FileUpload(props) {

    const [Images, setImages] = useState([]) // 이미지 여러개 올리기때문에 Array로 
    //이미지 올리고, 지울 때 image state가 변경


    const dropHandler = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' } // header에다가 어떤 파일인지 정의
        }
        formData.append("file", files[0]) //formData 파일에 대한 정보가 append를 이용해서 더해서 들어감
       
        axios.post('/api/product/image', formData, config) //formData, config 같이 안해주면 파일 보낼 때 오류
            .then(response => { // response 안에 파일 정보가 들어있음(서버->front)
                if (response.data.success) { //성공
                    //console.log(response.data)

                    setImages([...Images, response.data.filePath]) //Images 안에있는 있는 모든 것들을 다 넣어줌
                    props.refreshFunction([...Images, response.data.image])

                } else { // 실패
                    alert('파일 저장 실패')
                }
            })
    }

    const deleteHandler = (image) => { //사진 클릭하면 하나씩 지워짐
        const currentIndex = Images.indexOf(image);

        let newImages = [...Images] //image들을 복사
        newImages.splice(currentIndex,1) //splice라는 메소드 이용해서 currentIndex에서 시작해서 하나의 아이템을 지워줌

        setImages(newImages)
        props.refreshFunction(newImages)

    }



    return (

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Dropzone 
                // 드랍존을 이용해서 파일을 올림
                // 파일을 노드서버(백엔드)에다가 전달. => 저장
                // 다시 Front에 정보전달
                    onDrop={dropHandler}>
            
                    {({ getRootProps, getInputProps }) => (
                        <div style={{
                            width: '300px', height: '240px', border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: '3rem' }} />
    
                        </div>
                    )}
                </Dropzone>

                <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>

                {Images.map((image, index) => (
                    <div onClick = {()=>deleteHandler(image)} key = {index}>
                        <img style={{ 
                            minWidth: '300px', width: '300px', height: '240px' }} 
                            src={`http://localhost:5000/${image}`} />

                    </div>
                ))}
        </div>
     </div>
  )
}
  
export default FileUpload

