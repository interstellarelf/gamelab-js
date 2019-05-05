

/***************************
*   Incomplete Elements (html)
*
* Wanted Elements : Caption, various ImageSelects, etc...
****************************/


class Caption extends  MagicDom {

  constructor(src, scale){
    super(src);
    this.ScaleSize(scale || 1.0);
  }

}


class CaptionRow extends MagicDom {

  constructor(src, scale){
    super(src);
    this.ScaleSize(scale || 1.0);
  }

  Borders(top, bottom, selector)
  {

  }

  WidthPortion(scaleX)
  {

  }

}
