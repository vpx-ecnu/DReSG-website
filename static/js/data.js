window.DRESG_SUPP_DATA = {
  paths: {
    contentRoot: "static/content",
    mainRoot: "static/videos/main_results",
    supplementRoot: "static/videos/latest_selected_34_videos",
    styleRoot: "static/images/styles"
  },
  methods: [
    ["ours", "DReSG"],
    ["abcgs", "ABC-GS"],
    ["arf", "ARF"],
    ["sgsst", "SGSST"],
    ["clipgaussian", "CLIPGaussian"],
    ["fantasystyle", "FantasyStyle"]
  ],
  mainResults: [
    { pair: "fern-060", scene: "fern", style: "060" },
    { pair: "trex-065", scene: "trex", style: "065" },
    { pair: "horns-075", scene: "horns", style: "075" },
    { pair: "m60-079", scene: "m60", style: "079" },
    { pair: "family-078", scene: "family", style: "078" },
    { pair: "train-081", scene: "train", style: "081" }
  ],
  sections: [
    {
      containerId: "teaser-container",
      sets: [
        {
          title: "horns + fortress",
          meta: "Two content videos, three shared references, and six results",
          referenceClass: "five-up",
          mediaClass: "six-up",
          references: [
            { label: "horns", tag: "Content", type: "video", root: "content", file: "original_horns.mp4" },
            { label: "fortress", tag: "Content", type: "video", root: "content", file: "original_fortress.mp4" },
            { label: "Style A", tag: "Reference", type: "image", root: "style", file: "style_071.webp" },
            { label: "Style B", tag: "Reference", type: "image", root: "style", file: "style_009.webp" },
            { label: "Style C", tag: "Reference", type: "image", root: "style", file: "style_085.webp" }
          ],
          videos: [
            { label: "horns · A", tag: "Style A", file: "01_teaser_6/horns_071.mp4" },
            { label: "horns · B", tag: "Style B", file: "01_teaser_6/horns_009.mp4" },
            { label: "horns · C", tag: "Style C", file: "01_teaser_6/horns_085.mp4" },
            { label: "fortress · A", tag: "Style A", file: "01_teaser_6/fortress_071.mp4" },
            { label: "fortress · B", tag: "Style B", file: "01_teaser_6/fortress_009.mp4" },
            { label: "fortress · C", tag: "Style C", file: "01_teaser_6/fortress_085.mp4" }
          ]
        }
      ]
    },
    {
      containerId: "ablation1-container",
      sets: [
        {
          title: "fern",
          meta: "Attention and residual-strength variants",
          references: [
            { label: "Content", tag: "Input", type: "video", root: "content", file: "original_fern.mp4" },
            { label: "Style", tag: "Reference", type: "image", root: "style", file: "style_018.webp" }
          ],
          videos: [
            { label: "DReSG", tag: "Full", file: "02_ablation1_qkv_snr_18/fern_018_full.mp4" },
            { label: "w/o Content Q", tag: "Attention", file: "02_ablation1_qkv_snr_18/fern_018_wo_q.mp4" },
            { label: "w/o Style K", tag: "Attention", file: "02_ablation1_qkv_snr_18/fern_018_wo_k.mp4" },
            { label: "w/o Style V", tag: "Attention", file: "02_ablation1_qkv_snr_18/fern_018_wo_v.mp4" },
            { label: "fixed gamma = 1", tag: "SNR", file: "02_ablation1_qkv_snr_18/fern_018_wo_snr_p0.mp4" },
            { label: "fixed gamma = 2", tag: "SNR", file: "02_ablation1_qkv_snr_18/fern_018_wo_snr_p1.mp4" }
          ]
        },
        {
          title: "fortress",
          meta: "Attention and residual-strength variants",
          references: [
            { label: "Content", tag: "Input", type: "video", root: "content", file: "original_fortress.mp4" },
            { label: "Style", tag: "Reference", type: "image", root: "style", file: "style_038.webp" }
          ],
          videos: [
            { label: "DReSG", tag: "Full", file: "02_ablation1_qkv_snr_18/fortress_038_full.mp4" },
            { label: "w/o Content Q", tag: "Attention", file: "02_ablation1_qkv_snr_18/fortress_038_wo_q.mp4" },
            { label: "w/o Style K", tag: "Attention", file: "02_ablation1_qkv_snr_18/fortress_038_wo_k.mp4" },
            { label: "w/o Style V", tag: "Attention", file: "02_ablation1_qkv_snr_18/fortress_038_wo_v.mp4" },
            { label: "fixed gamma = 1", tag: "SNR", file: "02_ablation1_qkv_snr_18/fortress_038_wo_snr_p0.mp4" },
            { label: "fixed gamma = 2", tag: "SNR", file: "02_ablation1_qkv_snr_18/fortress_038_wo_snr_p1.mp4" }
          ]
        },
        {
          title: "horns",
          meta: "Attention and residual-strength variants",
          references: [
            { label: "Content", tag: "Input", type: "video", root: "content", file: "original_horns.mp4" },
            { label: "Style", tag: "Reference", type: "image", root: "style", file: "style_021.webp" }
          ],
          videos: [
            { label: "DReSG", tag: "Full", file: "02_ablation1_qkv_snr_18/horns_021_full.mp4" },
            { label: "w/o Content Q", tag: "Attention", file: "02_ablation1_qkv_snr_18/horns_021_wo_q.mp4" },
            { label: "w/o Style K", tag: "Attention", file: "02_ablation1_qkv_snr_18/horns_021_wo_k.mp4" },
            { label: "w/o Style V", tag: "Attention", file: "02_ablation1_qkv_snr_18/horns_021_wo_v.mp4" },
            { label: "fixed gamma = 1", tag: "SNR", file: "02_ablation1_qkv_snr_18/horns_021_wo_snr_p0.mp4" },
            { label: "fixed gamma = 2", tag: "SNR", file: "02_ablation1_qkv_snr_18/horns_021_wo_snr_p1.mp4" }
          ]
        }
      ]
    },
    {
      containerId: "ablation2-container",
      sets: [
        {
          title: "m60 & truck",
          meta: "3D-grounded feedback variants",
          rows: [
            {
              title: "m60",
              references: [
                { label: "Content", tag: "Input", type: "video", root: "content", file: "original_m60.mp4" },
                { label: "Style", tag: "Reference", type: "image", root: "style", file: "style_094.webp", ratio: 1074 / 544 }
              ],
              videos: [
                { label: "DReSG", tag: "Full", file: "03_ablation2_consistency_6/m60_094_ours_full.mp4" },
                { label: "w/o residual feedback", tag: "Feedback", file: "03_ablation2_consistency_6/m60_094_wo_render_feedback.mp4" },
                { label: "w/o color-grad projection", tag: "Projection", file: "03_ablation2_consistency_6/m60_094_wo_app_projection.mp4" }
              ]
            },
            {
              title: "truck",
              references: [
                { label: "Content", tag: "Input", type: "video", root: "content", file: "original_truck.mp4" },
                { label: "Style", tag: "Reference", type: "image", root: "style", file: "style_028.webp", ratio: 9 / 5 }
              ],
              videos: [
                { label: "DReSG", tag: "Full", file: "03_ablation2_consistency_6/truck_028_ours_full.mp4" },
                { label: "w/o residual feedback", tag: "Feedback", file: "03_ablation2_consistency_6/truck_028_wo_render_feedback.mp4" },
                { label: "w/o color-grad projection", tag: "Projection", file: "03_ablation2_consistency_6/truck_028_wo_app_projection.mp4" }
              ]
            }
          ]
        }
      ]
    },
    {
      containerId: "ablation3-container",
      sets: [
        {
          title: "fortress",
          meta: "Target-construction variants",
          columns: 2,
          references: [
            { label: "Content", tag: "Input", type: "video", root: "content", file: "original_fortress.mp4" },
            { label: "Style", tag: "Reference", type: "image", root: "style", file: "style_020.webp" }
          ],
          videos: [
            { label: "RGB-logit target", tag: "DReSG", file: "04_ablation3_logits_4/fortress_020_rgb_logit.mp4" },
            { label: "image-space residual", tag: "Variant", file: "04_ablation3_logits_4/fortress_020_image_residual.mp4" }
          ]
        },
        {
          title: "horns",
          meta: "Target-construction variants",
          columns: 2,
          references: [
            { label: "Content", tag: "Input", type: "video", root: "content", file: "original_horns.mp4" },
            { label: "Style", tag: "Reference", type: "image", root: "style", file: "style_069.webp" }
          ],
          videos: [
            { label: "RGB-logit target", tag: "DReSG", file: "04_ablation3_logits_4/horns_069_rgb_logit.mp4" },
            { label: "image-space residual", tag: "Variant", file: "04_ablation3_logits_4/horns_069_image_residual.mp4" }
          ]
        }
      ]
    }
  ]
};
