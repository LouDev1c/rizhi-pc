!macro customUnInstall
  MessageBox MB_YESNO|MB_ICONQUESTION "是否删除 RiZhi 的本地记录文件？$\r$\n$\r$\n选择“是”会删除 AppData\Roaming 下的 RiZhi memory 文件夹。$\r$\n选择“否”会保留 memory 文件夹和其中的文件。" IDYES deleteMemory IDNO keepMemory

  deleteMemory:
    RMDir /r "$APPDATA\RiZhi\memory"
    RMDir /r "$APPDATA\rizhi\memory"

  keepMemory:
!macroend
