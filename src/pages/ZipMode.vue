<template>
  <div style="width: 100%;" class="zipWrapper">
    <NavBar style="background-color: white;">
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
              <!-- <div>maximum file size: 5 MB</div> -->
            </div>
          </div>  
          <input type="file" @change="onChange">
        </div>
      </div>
      <div v-else class="dropZone-uploaded p-8" style="margin:0 auto">
        <div class="uploadedFile-info" style="padding: 20px 20px 0 20px;">
          <div>File Name: {{ file.name }}</div>
          <div>File Size: {{ file.size }} bytes</div>
        </div>
        
        <div style="margin:20px 20px 0 20px; width: 40%">
          <v-select dense variant="outlined" v-model="selectedModel" :items="items" label="Select a model"></v-select>
        </div>


        <div class="dropZone-uploaded-info">
          <div style="display: flex;" v-if="!downloadUrl">
            <v-btn type="button" style="background-color:#B8252B; color:white;"
              class="mr-8 mt-8 btn btn-primary removeFile" @click="removeFile">Remove File</v-btn>
            <v-btn type="button" class="mt-8 btn btn-primary removeFile" @click="uploadZipFile">Submit</v-btn>
          </div>
          <div style="display: flex;" v-else>
            <v-btn type="button" style="background-color:#B8252B; color:white;"
              class="mr-8 mt-8 btn btn-primary removeFile" @click="removeFile">Remove File</v-btn>
            <v-btn type="button" style="font-size:smaller" class="mt-8 btn btn-primary removeFile" :href="downloadUrl" download="result.zip">Download Results<i class="fa fa-download pl-2"></i></v-btn>
          </div>
          <div style="padding-top: 40px;" v-if="loading">
            <v-progress-circular indeterminate></v-progress-circular>
            <p> Processing Your Documents</p>
          </div>
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
      loading: false,
      selectedModel: 'SVM Model',
      items: ['SVM Model', 'LayoutLMv3 Model'],
      downloadUrl: null,
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

      this.file = file;
      console.log(this.file);
      this.dragging = false;
    },
    removeFile() {
      this.file = null;
      this.downloadUrl = null;
    },
    async uploadZipFile() {
      let url = 'http://52.70.151.60/upload-zip';
      if(this.selectedModel==='SVM Model') url = 'http://52.70.151.60/upload-zip-2'

      this.loading = true;

      const formData = new FormData();
      formData.append('file', this.file);
      await fetch(url, {
        method: 'POST',
        body: formData,
        timeout: 300000000,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Http error');
          }
          return response.blob();
        }).then(blob => {
          this.downloadUrl = URL.createObjectURL(blob);
          console.log(this.downloadUrl)
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
.zipWrapper{
  background-color: var(--bgcolor);
  height: 100%;
}

.dropZone {
  width: 80%;
  height: 300px;
  background-color: white;
  position: relative;
  border: 2px solid #2e94c4;
}

.dropZone:hover {
  background-color: var(--bgcolor);
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
  background-color: white;
  position: relative;
  border: 2px solid #2e94c4;
}

.dropZone-uploaded-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #A8A8A8;
  position: relative;
  padding-bottom: 40px;
  width: 100%;
  text-align: center;
}

.removeFile {
  width: 200px;
}
</style>