declare module "redux-modular" {
  interface Actions {
    [key: string]: string;
  }

  interface MountResult {
    actions: Actions;
    reducer: function;
    selectors: {
      [key: string]: function;
    };
  }

  interface MountConfig {
    actions?: {
      [key]: function | any;
    };
    reducer?: function (Actions) : function () : void;
    selectors?: function (function) : {
      [key: string]: function ()
    };
  }

  export function mount(path: string, config: MountConfig): MountResult {}
}
