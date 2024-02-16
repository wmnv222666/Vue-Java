/** Date: 2019/1/25 ; Author: 姜啸 **/

import txt from '@/assets/images/iconFile/txt.svg'
import gif from '@/assets/images/iconFile/gif.svg'
import jpg from '@/assets/images/iconFile/jpg.svg'
import png from '@/assets/images/iconFile/png.svg'
import doc from '@/assets/images/iconFile/doc.svg'
import ppt from '@/assets/images/iconFile/ppt.svg'
import pdf from '@/assets/images/iconFile/pdf.svg'
import xls from '@/assets/images/iconFile/xls.svg'
import psd from '@/assets/images/iconFile/psd.svg'
import other from '@/assets/images/iconFile/othe.svg'
import html from '@/assets/images/iconFile/html.svg'
import zip from '@/assets/images/iconFile/zip.svg'
import avi from '@/assets/images/iconFile/avi.svg'
import rmvb from '@/assets/images/iconFile/rmvb.svg'
import mp4 from '@/assets/images/iconFile/mp4.svg'
import mkv from '@/assets/images/iconFile/mkv.svg'
import mpg from '@/assets/images/iconFile/mpg.svg'
import wav from '@/assets/images/iconFile/wav.svg'
import mp3 from '@/assets/images/iconFile/mp3.svg'
import dll from '@/assets/images/iconFile/dll.svg'
import exe from '@/assets/images/iconFile/exe.svg'
import swf from '@/assets/images/iconFile/swf.svg'

export function fileIcon (ext) {
  switch (ext) {
    case 'txt':
      return txt
    case 'gif':
      return gif
    case 'jpg':
      return jpg
    case 'png':
      return png
    case 'doc':
    case 'docx':
      return doc
    case 'ppt':
    case 'pptx':
      return ppt
    case 'pdf':
      return pdf
    case 'xls':
    case 'xlsx':
      return xls
    case 'psd':
      return psd
    case 'html':
      return html
    case 'zip': case 'rar': case 'gzip': case '7-zip': case 'tar': case 'cab': case 'arj': case 'lzh': case 'ace': case 'uue': case 'bz2': case 'jar': case 'iso':
      return zip
    case 'avi':
      return avi
    case 'rmvb':
      return rmvb
    case 'mp4':
      return mp4
    case 'mkv':
      return mkv
    case 'mpg':
      return mpg
    case 'wav':
      return wav
    case 'mp3':
      return mp3
    case 'dll':
      return dll
    case 'exe':
      return exe
    case 'swf':
      return swf
    default:
      return other
  }
}
