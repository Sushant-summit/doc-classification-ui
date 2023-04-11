<template>
  <div style="width: 100%;">
    <NavBar>
      <img src="src/assets/documindbg.png" style="height: 100%; object-fit: contain" />
      DocUMind
    </NavBar>

    <div style="margin:40px auto">
      <div v-if="!file">
        <div :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true"
          @dragleave="dragging = false" style="margin:0 auto">
          <div class="dropZone-info" @drag="onChange">
            <span class="fa fa-cloud-upload dropZone-title"></span>
            <span class="dropZone-title">Drop file or click to upload</span>
            <div class="dropZone-upload-limit-info">
              <div>extension support: zip</div>
              <div>maximum file size: 5 MB</div>
            </div>
          </div>  
          <input type="file" @change="onChange">
        </div>
      </div>
      <div v-else class="dropZone-uploaded p-8" style="margin:0 auto">
        <div class="dropZone-uploaded-info">
          <span class="dropZone-title">Uploaded</span>
          <v-btn type="button" style="background-color:#B8252B; color:white;" class="mt-8 btn btn-primary removeFile" @click="removeFile">Remove File</v-btn>
          <v-btn type="button" class="mt-8 btn btn-primary removeFile" @click="uploadZipFile">Submit</v-btn>
          <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
        </div>

        <div class="uploadedFile-info" style="padding: 10px;">
          <div>File Name: {{ file.name }}</div>
          <div>File Size: {{ file.size }} bytes</div>
        </div>
        
      </div>


    </div>



  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      file: null,
      loading: false
    }
  },
  methods: {
    onChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      if (!files.length) {
        this.dragging = false;
        return;
      }

      this.createFile(files[0]);
    },
    createFile(file) {
      if (file.size > 5000000) {
        alert('please check file size no over 5 MB.')
        this.dragging = false;
        return;
      }

      this.file = file;
      console.log(this.file);
      this.dragging = false;
    },
    removeFile() {
      this.file = '';
    },
    async uploadZipFile() {
      this.loading = true;
      
      const formData = new FormData();
      formData.append('file', this.file);
      await fetch('http://127.0.0.1:8000/upload-zip', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if(!response.ok){
          throw new Error('Http error');
        }
        return response.blob();
      }).then(blob => {
        const url = URL.createObjectURL(blob);
        console.log(url)
        window.open(url, 'result.zip');
        this.loading = false;
      })
      .catch(error => {
        console.log(error)
      })
      // handle response from backend
    }
  },
  computed: {
    extension() {
      return (this.file) ? this.file.name.split('.').pop() : '';
    }
  }
}
</script>

<style>
.dropZone {
  width: 80%;
  height: 200px;
  position: relative;
  border: 2px dashed #eee;
}

.dropZone:hover {
  border: 2px solid #2e94c4;
}

.dropZone:hover .dropZone-title {
  color: #1975A0;
}

.dropZone-info {
  color: #A8A8A8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.dropZone-title {
  color: #787878;
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dropZone-upload-limit-info {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.dropZone-over {
  background: #5C5C5C;
  opacity: 0.8;
}

.dropZone-uploaded {
  width: 80%;
  height: 200px;
  position: relative;
  border: 2px dashed #eee;
}

.dropZone-uploaded-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #A8A8A8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.removeFile {
  width: 200px;
}
</style>