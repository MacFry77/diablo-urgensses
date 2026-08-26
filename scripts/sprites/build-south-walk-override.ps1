Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public static class SouthWalkBuilder {
  static int AlphaFor(Color color) {
    int dominance = Math.Min(color.R, color.B) - color.G;
    if (dominance >= 75) return 0;
    if (dominance <= 25) return 255;
    return 255 - (dominance - 25) * 255 / 50;
  }

  public static void Build(string input, string outputDirectory) {
    using (var source = new Bitmap(input)) {
      int cellWidth = source.Width / 3;
      for (int frame = 0; frame < 3; frame++) {
        using (var keyed = new Bitmap(cellWidth, source.Height, PixelFormat.Format32bppArgb)) {
          int minX = cellWidth, minY = source.Height, maxX = -1, maxY = -1;
          for (int y = 0; y < source.Height; y++) for (int x = 0; x < cellWidth; x++) {
            Color color = source.GetPixel(frame * cellWidth + x, y);
            int alpha = AlphaFor(color);
            keyed.SetPixel(x, y, Color.FromArgb(alpha, color.R, color.G, color.B));
            if (alpha >= 24) { minX=Math.Min(minX,x); maxX=Math.Max(maxX,x); minY=Math.Min(minY,y); maxY=Math.Max(maxY,y); }
          }
          int cropWidth=maxX-minX+1, cropHeight=maxY-minY+1;
          const double scale=0.72;
          int drawWidth=(int)Math.Round(cropWidth*scale), drawHeight=(int)Math.Round(cropHeight*scale);
          using (var output=new Bitmap(420,760,PixelFormat.Format32bppArgb)) {
            using (var graphics=Graphics.FromImage(output)) {
              graphics.Clear(Color.Transparent);
              graphics.InterpolationMode=InterpolationMode.HighQualityBicubic;
              graphics.DrawImage(keyed,new Rectangle((420-drawWidth)/2,752-drawHeight,drawWidth,drawHeight),new Rectangle(minX,minY,cropWidth,cropHeight),GraphicsUnit.Pixel);
            }
            output.Save(Path.Combine(outputDirectory,frame+".png"),ImageFormat.Png);
          }
        }
      }
    }
  }
}
'@ -ReferencedAssemblies System.Drawing

$repositoryRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$source = Join-Path $repositoryRoot 'docs\sprites\animations\walk-south-override-source.png'
$southOutput = Join-Path $repositoryRoot 'public\sprites\urgentiste-dechoc\walk\south'
New-Item -ItemType Directory -Force $southOutput | Out-Null
[SouthWalkBuilder]::Build($source, $southOutput)

$southWestOutput = Join-Path $repositoryRoot 'public\sprites\urgentiste-dechoc\walk\south-west'
$southEastOutput = Join-Path $repositoryRoot 'public\sprites\urgentiste-dechoc\walk\south-east'
foreach ($frame in 0..2) {
  $sourcePath = Join-Path $southWestOutput "$frame.png"
  $destinationPath = Join-Path $southEastOutput "$frame.png"
  $sourceSprite = [System.Drawing.Bitmap]::FromFile($sourcePath)
  $destinationSprite = $sourceSprite.Clone()
  $sourceSprite.Dispose()
  $destinationSprite.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
  $destinationSprite.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $destinationSprite.Dispose()
}
Write-Output 'Corrected SOUTH and SOUTH-EAST walking frames.'
