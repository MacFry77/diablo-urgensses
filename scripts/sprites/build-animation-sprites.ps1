Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Collections.Generic;

public static class AnimationSpriteBuilder {
  static int AlphaFor(Color color, bool magenta) {
    int dominance = magenta
      ? Math.Min(color.R, color.B) - color.G
      : color.G - Math.Max(color.R, color.B);
    if (dominance >= 75) return 0;
    if (dominance <= 25) return 255;
    return 255 - (dominance - 25) * 255 / 50;
  }

  static Rectangle[] FindRows(Bitmap source, bool magenta) {
    var rows = new System.Collections.Generic.List<Rectangle>();
    int start = -1;
    for (int y = 0; y < source.Height; y++) {
      int occupied = 0;
      for (int x = 0; x < source.Width; x += 2)
        if (AlphaFor(source.GetPixel(x, y), magenta) >= 24) occupied++;
      bool active = occupied >= 10;
      if (active && start < 0) start = y;
      if (!active && start >= 0) {
        if (y - start > 40) rows.Add(new Rectangle(0, Math.Max(0, start - 3), source.Width, Math.Min(source.Height, y + 3) - Math.Max(0, start - 3)));
        start = -1;
      }
    }
    if (start >= 0) rows.Add(new Rectangle(0, start, source.Width, source.Height - start));
    if (rows.Count != 3) throw new Exception("Expected three animation rows, found " + rows.Count);
    return rows.ToArray();
  }

  public static void Build(string input, string outputRoot, bool magenta) {
    string[] directions = { "south", "south-west", "west", "north-west", "north", "north-east", "east", "south-east" };
    using (var source = new Bitmap(input)) {
      int cellWidth = source.Width / 8;
      Rectangle[] rowBands = FindRows(source, magenta);
      for (int row = 0; row < 3; row++) {
        for (int column = 0; column < 8; column++) {
          int sourceX = column * cellWidth;
          int sourceY = rowBands[row].Y;
          int cellHeight = rowBands[row].Height;
          using (var keyed = new Bitmap(cellWidth, cellHeight, PixelFormat.Format32bppArgb)) {
            int minX = cellWidth, minY = cellHeight, maxX = -1, maxY = -1;
            for (int y = 0; y < cellHeight; y++) {
              for (int x = 0; x < cellWidth; x++) {
                Color color = source.GetPixel(sourceX + x, sourceY + y);
                int alpha = AlphaFor(color, magenta);
                keyed.SetPixel(x, y, Color.FromArgb(alpha, color.R, color.G, color.B));
                if (alpha >= 24) {
                  minX = Math.Min(minX, x); maxX = Math.Max(maxX, x);
                  minY = Math.Min(minY, y); maxY = Math.Max(maxY, y);
                }
              }
            }
            var visited = new bool[cellWidth * cellHeight];
            var largest = new List<Point>();
            for (int y = 0; y < cellHeight; y++) for (int x = 0; x < cellWidth; x++) {
              int startIndex = y * cellWidth + x;
              if (visited[startIndex] || keyed.GetPixel(x, y).A < 24) continue;
              var component = new List<Point>();
              var queue = new Queue<Point>();
              queue.Enqueue(new Point(x, y)); visited[startIndex] = true;
              while (queue.Count > 0) {
                Point point = queue.Dequeue(); component.Add(point);
                int[,] neighbours = { { point.X - 1, point.Y }, { point.X + 1, point.Y }, { point.X, point.Y - 1 }, { point.X, point.Y + 1 } };
                for (int n = 0; n < 4; n++) {
                  int nx = neighbours[n, 0], ny = neighbours[n, 1];
                  if (nx < 0 || nx >= cellWidth || ny < 0 || ny >= cellHeight) continue;
                  int ni = ny * cellWidth + nx;
                  if (!visited[ni] && keyed.GetPixel(nx, ny).A >= 24) { visited[ni] = true; queue.Enqueue(new Point(nx, ny)); }
                }
              }
              if (component.Count > largest.Count) largest = component;
            }
            var retained = new bool[cellWidth * cellHeight];
            foreach (Point point in largest) retained[point.Y * cellWidth + point.X] = true;
            minX = cellWidth; minY = cellHeight; maxX = -1; maxY = -1;
            for (int y = 0; y < cellHeight; y++) for (int x = 0; x < cellWidth; x++) {
              if (!retained[y * cellWidth + x]) keyed.SetPixel(x, y, Color.Transparent);
              else { minX = Math.Min(minX, x); maxX = Math.Max(maxX, x); minY = Math.Min(minY, y); maxY = Math.Max(maxY, y); }
            }
            if (maxX < minX || maxY < minY) throw new Exception("Empty animation cell");
            int cropWidth = maxX - minX + 1, cropHeight = maxY - minY + 1;
            // Every generated cell uses the same source character scale. Keep one
            // constant factor so gait and attack poses never breathe in size.
            double scale = 2.0;
            int drawWidth = (int)Math.Round(cropWidth * scale);
            int drawHeight = (int)Math.Round(cropHeight * scale);
            using (var output = new Bitmap(420, 760, PixelFormat.Format32bppArgb)) {
              using (var graphics = Graphics.FromImage(output)) {
                graphics.Clear(Color.Transparent);
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                graphics.DrawImage(keyed,
                  new Rectangle((420 - drawWidth) / 2, 752 - drawHeight, drawWidth, drawHeight),
                  new Rectangle(minX, minY, cropWidth, cropHeight),
                  GraphicsUnit.Pixel);
              }
              string directory = Path.Combine(outputRoot, directions[column]);
              Directory.CreateDirectory(directory);
              output.Save(Path.Combine(directory, row + ".png"), ImageFormat.Png);
            }
          }
        }
      }
    }
  }
}
'@ -ReferencedAssemblies System.Drawing

$repositoryRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$walkSource = Join-Path $repositoryRoot 'docs\sprites\animations\walk-source.png'
$strikeSource = Join-Path $repositoryRoot 'docs\sprites\animations\strike-source.png'
$walkOutput = Join-Path $repositoryRoot 'public\sprites\urgentiste-dechoc\walk'
$strikeOutput = Join-Path $repositoryRoot 'public\sprites\urgentiste-dechoc\strike'
[AnimationSpriteBuilder]::Build($walkSource, $walkOutput, $true)
[AnimationSpriteBuilder]::Build($strikeSource, $strikeOutput, $false)
foreach ($animationRoot in @($walkOutput, $strikeOutput)) {
  foreach ($frame in 0..2) {
    $eastPath = Join-Path $animationRoot "east\$frame.png"
    $westPath = Join-Path $animationRoot "west\$frame.png"
    $eastSprite = [System.Drawing.Bitmap]::FromFile($eastPath)
    $westSprite = $eastSprite.Clone()
    $eastSprite.Dispose()
    $westSprite.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
    $westSprite.Save($westPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $westSprite.Dispose()
  }
}
Write-Output 'Created 24 walk sprites and 24 strike sprites.'
