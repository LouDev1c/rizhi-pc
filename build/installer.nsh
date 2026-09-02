!macro customUnInstall
  MessageBox MB_YESNO|MB_ICONQUESTION "是否删除 RiZhi 的本地记录文件？$\r$\n$\r$\n选择“是”会删除安装目录下的 memory 文件夹。$\r$\n选择“否”会保留 memory 文件夹和其中的文件。" IDYES deleteMemory IDNO keepMemory

  deleteMemory:
    RMDir /r "$INSTDIR\memory"

  keepMemory:
!macroend
