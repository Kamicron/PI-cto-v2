

export{}
declare global {
  interface ILightFolder {
    id: string;
    createdAt: Date;
    name: string;
  }
  
  interface IFolder {
    id: string;
    name: string;
    createdAt: Date;
    children: ILightFolder[];
    parent: ILightFolder | null;
  }
  
  interface IFile {
    id: string;
    name: string;
    url: string;
    createdAt: Date;
  }
}