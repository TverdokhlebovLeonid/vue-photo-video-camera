<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { showMessage } from '@/helpers/element'
import { base64Blob } from '@/helpers/converting'
import { useRouter } from 'vue-router'
import type { IFormData } from '@/components/VideoCamera/interfaceVideoCamera'
import { postSendFotoVideo } from '@/api/api'

const LIMIT_NUMBER_CAMERAS = 2
const numberCameras = ref<MediaDeviceInfo[]>([])
const isLimitCameras = computed((): boolean => numberCameras.value.length < LIMIT_NUMBER_CAMERAS)

const isSwitchPhotoVideo = ref<boolean>(false)
const cameraMode = computed((): string => (isSwitchPhotoVideo.value ? 'Режим видео' : 'Режим фото'))
const nameRecordButton = computed((): string => (isSwitchPhotoVideo.value ? 'Запись' : 'Снимок'))

const router = useRouter()
const closeWindow = (): void => {
  router.push({ name: 'home' })
}

const camera = ref<HTMLVideoElement>()
const mediaRecorder = ref<MediaRecorder>()
const isVideoOpen = ref<boolean>(false)
const isAudioCanel = ref<boolean>(false)
const isLoading = ref<boolean>(true)
const connectedCamera = ref<string>('user')
const startCamera = (): void => {
  isLoading.value = true
  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    isVideoOpen.value = true
    const constraints = {
      audio: isAudioCanel.value,
      video: {
        facingMode: connectedCamera.value,
      },
    }
    getDevices()
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (camera.value) camera.value.srcObject = stream
        mediaRecorder.value = new MediaRecorder(stream)
        showMessage('Камера подключена')
      })
      .catch(() => {
        showMessage('Ошибка в подключении камеры', 'error')
      })
      .finally(() => {
        isLoading.value = false
      })
  } else {
    showMessage('Нельзя подключить камеру', 'error')
  }
}
const getDevices = async (): Promise<void> => {
  await navigator.mediaDevices.enumerateDevices().then((res) => {
    numberCameras.value = res.filter((i) => i.kind === 'videoinput')
  })
}
const stopCamera = (): void => {
  isVideoOpen.value = false
  if (camera.value?.srcObject) {
    const tracks = (camera.value.srcObject as MediaStream).getTracks()
    tracks.forEach((track) => track.stop())
  }
}
const switchCamera = (): void => {
  connectedCamera.value = connectedCamera.value === 'user' ? 'environment' : 'user'
  stopCamera()
  nextTick(() => {
    startCamera()
  })
}

const videoUrl = ref<string>('')
const blobVideo = ref<Blob>()
const mediaChunks = ref<Blob[]>([])
const convertRecord = (): void => {
  blobVideo.value = new Blob(mediaChunks.value, { type: 'video/webm' })
  videoUrl.value = window.URL.createObjectURL(blobVideo.value)
}

const canvas = ref<HTMLCanvasElement>()
const blobPhoto = ref<Blob>()
const isVideoRecord = ref<boolean>(false)
const photoUrl = ref<string>('')
const convertPhoto = (): void => {
  const photo = canvas.value?.toDataURL('image/jpeg') || ''
  if (photo) {
    blobPhoto.value = base64Blob(photo)
    photoUrl.value = window.URL.createObjectURL(blobPhoto.value)
  }
}
const startRecording = (): void => {
  videoUrl.value = ''
  isVideoRecord.value = true
  mediaChunks.value = []
  mediaRecorder.value?.start()
}

const stopRecording = (): void => {
  isVideoRecord.value = false
  if (mediaRecorder.value) {
    mediaRecorder.value.stop()
    mediaRecorder.value.ondataavailable = (e: BlobEvent) => {
      if (e.data) mediaChunks.value.push(e.data)
      convertRecord()
    }
  }
}

const isTakePhoto = ref<boolean>(false)
const takePhoto = (): void => {
  photoUrl.value = ''
  isTakePhoto.value = true
  nextTick(() => {
    isTakePhoto.value = false
  })
  if (canvas.value && camera.value) {
    const context = canvas.value.getContext('2d')
    context?.drawImage(camera.value, 0, 0, 600, 450)
  }
  nextTick(() => {
    convertPhoto()
  })
}
const switchPhotoVideo = (): void => {
  isSwitchPhotoVideo.value = !isSwitchPhotoVideo.value
}
const switchRecording = (): void => {
  isSwitchPhotoVideo.value
    ? isVideoRecord.value
      ? stopRecording()
      : startRecording()
    : takePhoto()
}

const clearData = (): void => {
  photoUrl.value = ''
  videoUrl.value = ''
}
const sendRecording = (): void => {
  isLoading.value = true
  const formData: IFormData = {
    file: isSwitchPhotoVideo.value ? blobVideo.value : blobPhoto.value,
  }
  const payload = new FormData()
  for (const key in formData) {
    if (formData[key]) payload.append(key, formData[key] as Blob)
  }
  postSendFotoVideo(payload)
    .then(() => {
      clearData()
      showMessage('Файл сохранён', 'success')
    })
    .finally(() => {
      isLoading.value = false
    })
}

onMounted(() => {
  startCamera()
})
onBeforeUnmount(() => {
  stopCamera()
})
</script>

<template>
  <div class="camera">
    <el-row>
      <el-col :span="20" v-loading="isLoading">
        <template v-if="isVideoOpen">
          <video
            class="camera__video"
            :class="[{ camera__video_record: isVideoRecord }, { camera__video_photo: isTakePhoto }]"
            ref="camera"
            muted
            autoplay
          />
          <canvas :width="600" :height="450" v-show="false" ref="canvas" />
        </template>
      </el-col>
      <el-col class="camera__panel" :span="4">
        <el-button type="primary" size="large" @click="closeWindow">
          Закрыть
          <el-icon><CloseBold /></el-icon>
        </el-button>
        <div class="camera__panel_block-button">
          <el-button type="primary" :disabled="isLimitCameras" @click="switchCamera">
            Смена камеры
          </el-button>
          <el-button :type="isVideoRecord ? 'danger' : 'primary'" round @click="switchRecording">
            {{ nameRecordButton }}
          </el-button>
          <el-button type="primary" @click="switchPhotoVideo"> Смена режима </el-button>
          <el-text size="large" tag="b" type="info">{{ cameraMode }}</el-text>
        </div>
        <el-switch
          v-model="isAudioCanel"
          size="large"
          active-text="Со звуком"
          inactive-text="Без звука"
          style="--el-switch-on-color: #138306; --el-switch-off-color: #660202"
          inline-prompt
          width="150"
          :disabled="!isSwitchPhotoVideo"
        />
      </el-col>
    </el-row>
    <div class="camera__window" v-if="photoUrl || videoUrl">
      <img class="camera__window_img" :src="photoUrl" v-if="photoUrl" />
      <video class="camera__window_img" :src="videoUrl" v-if="videoUrl" controls />
      <div class="camera__window_button">
        <el-button type="primary" size="large" @click="sendRecording"> Сохранить </el-button>
        <el-button type="danger" size="large" @click="clearData"> Удалить </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.camera {
  height: 100vh;
  background-color: #020236;
  overflow: hidden;
  .el-row {
    height: 100vh;
  }
  &__video {
    height: 100%;
    width: 100%;
    overflow: hidden;
    &_record {
      height: 99%;
      border: 3px solid red;
      transition: all 0.2s ease;
    }
    &_photo {
      height: 99%;
      border: 3px solid red;
      opacity: 0.5;
      transition: all 0.1s ease;
    }
  }
  &__panel {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 20px 10px;
    button {
      width: 150px;
      height: 35px;
      .el-icon {
        margin-left: 40px;
      }
    }
    &_block-button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      button {
        margin: 20px;
        width: 150px;
        height: 40px;
      }
      .is-round {
        height: 70px;
      }
    }
  }
  &__window {
    width: 40%;
    position: fixed;
    left: 2%;
    bottom: 3%;
    border-radius: 10px;
    &_img {
      width: 100%;
      height: 100%;
    }
    &_button {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      button {
        width: 49%;
      }
    }
  }
}
</style>
